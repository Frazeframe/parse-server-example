Parse.Cloud.afterSave('Vote', function(request) {

	var voteWeight = request.object.get("weight");

	var photoPointer = request.object.get("photo");

	var PhotoClass = Parse.Object.extend("Photo");
	var query = new Parse.Query(PhotoClass);
	query.get(photoPointer.id, {
	  success: function(photo) {
	    var user = photo.get("createdBy");

			var userId = user.id;

			var voteCreator = request.object.get("createdBy");

			if (voteWeight == 1 && voteCreator.id != userId) {
				var targetUser = new Parse.User();
				targetUser.id = userId;

				var query = new Parse.Query(Parse.Installation);
				query.equalTo('user', user);

				Parse.Push.send({
				  where: query,
				  data: {
				    alert: 'You got an upvote on your photo!',
				    badge: 'Increment',
				    sound: 'default'
				  }
				}, {
				  useMasterKey: true,
				  success: function() {
				    console.log("Notification for vote sent!");
				  },
				  error: function(error) {
				    console.log(error);
				  }
				});
			}
	  },
	  error: function(object, error) {
	    console.log("Error getting photo object.")
	  }
	});
});
