Parse.Cloud.afterSave('Vote', function(request) {

	var voteWeight = request.object.get("weight");

	var photo = request.object.get("photo");

	var user = photo.object.get("createdBy");
	var userId = user.id;

	if (voteWeight == 1) {
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
});
