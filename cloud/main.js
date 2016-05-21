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
						var pushNotificationMessage = String(voteCreator.get("username")).capitalizeFirstLetter()  + " commented: "  + String(request.object.get("commentText");
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
