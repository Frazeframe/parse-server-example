Parse.Cloud.afterSave('Vote', function(request) {
	Parse.cloud.useMasterkey();

	var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("username", "berlinluke");

	Parse.Push.send({
	  where: pushQuery,
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
});
