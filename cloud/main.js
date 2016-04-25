Parse.Cloud.afterSave('Vote', function(request) {

	var UserClass = Parse.Object.extend("User");
	var query = new Parse.Query(UserClass);
	query.equalTo("objectId", request.object.get("createdBy").id);

	Parse.Push.send({
	  where: query,
	  data: {
	    alert: "You got a push notification!"
	  }
	}, {
	  success: function() {
	    // Push was successful
	  },
	  error: function(error) {
	    // Handle error
	  }
	});
})
