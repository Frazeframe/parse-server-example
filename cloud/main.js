//-----------------------------------------------------------------------------
// Helper methods
//-----------------------------------------------------------------------------

function sendPushNotificationMessageWithUser(message, user) {
  var query = new Parse.Query(Parse.Installation);
	query.equalTo('user', user);

	Parse.Push.send({
	  where: query,
	  data: {
	    alert: message,
	    badge: 'Increment',
	    sound: 'default'
	  }
	}, {
	  useMasterKey: true,
	  success: function() {
	    console.log("Notification sent!");
	  },
	  error: function(error) {
	    console.log(error);
	  }
	});
}

String.prototype.capitalizeFirstLetter = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

//-----------------------------------------------------------------------------
// Voting
//-----------------------------------------------------------------------------

Parse.Cloud.beforeSave('Vote', function(request, response) {
	var createdByPointer = request.object.get("createdBy");
	var photoPointer = request.object.get("photo");

	if (!createdByPointer || !photoPointer) {
    response.error('Vote must have createdBy and photo.');
  } else {
  	var VoteClass = Parse.Object.extend("Vote");
    var query = new Parse.Query(VoteClass);

    query.equalTo("createdBy", createdByPointer);
    query.equalTo("photo", photoPointer);
    query.first({
      success: function(object) {
        if (object && (request.object.id != object.id)) {
          response.error("User has already voted on this photo.");
        } else {

        	// Adjust total votes from photo.
        	var totalVotesQuery = new Parse.Query(VoteClass);
    			totalVotesQuery.equalTo("photo", photoPointer);
					totalVotesQuery.find({
					  success: function(results) {
					  	var totalVoteAmount = 0;
					  	for (var index = 0; index < results.length; index++) {
					  		if (request.object.id != results[index].id) {
					  			totalVoteAmount += results[index].get("weight");
					  		}
					  	}
					  	totalVoteAmount += request.object.get("weight");

					  	var PhotoClass = Parse.Object.extend("Photo");
					  	var photoQuery = new Parse.Query(PhotoClass);
							photoQuery.get(photoPointer.id, {
								success: function(object) {
									console.log(totalVoteAmount);
									object.set('totalVotes', totalVoteAmount);
									object.save();
									response.success();
								},
								error: function(error) {
									console.log("Could not find votes.");
									response.success();
					      }
							});
					  },
					  error: function(error) {
					  	console.log("Could not find photo.");
					  	response.success();
					  }
					});
        }
      },
      error: function(error) {
        response.error("Could not validate uniqueness for this vote object.");
      }
    });
  }
});

Parse.Cloud.afterSave('Vote', function(request) {
	var voteWeight = request.object.get("weight");
	var photoPointer = request.object.get("photo");

	// Get photo object being voted on.
	var PhotoClass = Parse.Object.extend("Photo");
	var query = new Parse.Query(PhotoClass);
	query.get(photoPointer.id, {
	  success: function(photo) {
	    var user = photo.get("createdBy");
			var userId = user.id;
			var voteCreatorPointer = request.object.get("createdBy");

			// Send push notification.
			if (voteWeight == 1 && voteCreatorPointer.id != userId) {
				// Get user who created vote.
				var UserClass = Parse.Object.extend("User");
				var voteCreatorQuery = new Parse.Query(UserClass);
				voteCreatorQuery.get(voteCreatorPointer.id, {
					success: function(voteCreator) {
						var pushNotificationMessage = String(voteCreator.get("username")).capitalizeFirstLetter()  + " upvoted your photo!";
						sendPushNotificationMessageWithUser(pushNotificationMessage, user);
					},
				  error: function(object, error) {
				  	sendPushNotificationMessageWithUser('You got an upvote on your photo!', user);
				  }
				});
			}
	  },
	  error: function(object, error) {
	    console.log("Error getting photo object.");
	  }
	});
});

//-----------------------------------------------------------------------------
// Comments
//-----------------------------------------------------------------------------

Parse.Cloud.afterSave('Comment', function(request) {
	var photoPointer = request.object.get("photo");

	// Get photo object being commented on.
	var PhotoClass = Parse.Object.extend("Photo");
	var query = new Parse.Query(PhotoClass);
	query.get(photoPointer.id, {
	  success: function(photo) {
	    var user = photo.get("createdBy");
			var userId = user.id;
			var voteCreatorPointer = request.object.get("createdBy");

			if (voteCreatorPointer.id != userId) {
				// Get user who created vote.
				var UserClass = Parse.Object.extend("User");
				var voteCreatorQuery = new Parse.Query(UserClass);
				voteCreatorQuery.get(voteCreatorPointer.id, {
					success: function(voteCreator) {
						var pushNotificationMessage = String(voteCreator.get("username")).capitalizeFirstLetter()  + " commented: "  + String(request.object.get("commentText"));
						sendPushNotificationMessageWithUser(pushNotificationMessage, user);
					},
				  error: function(object, error) {
				  	var pushNotificationMessage = "Someone commented on your photo!";
				  	sendPushNotificationMessageWithUser(pushNotificationMessage, user);
				  }
				});
			}
	  },
	  error: function(object, error) {
	    console.log("Error getting photo object.")
	  }
	});
});
