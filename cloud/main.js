Parse.Cloud.afterSave('Vote', function(request) {

	var voteWeight = request.object.get("weight");
	var user = request.object.get("createdBy");
	var userId = user.id;

	if (voteWeight == 1) {
		var UserClass = Parse.Object.extend("User");
		var pushQuery = new Parse.Query(UserClass);
	  pushQuery.equalTo("objectId", userId);

		Parse.Push.send({
		  where: pushQuery,
		  data: {
		    alert: 'You got a prop on your photo!',
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
