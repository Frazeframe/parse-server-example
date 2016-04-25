Parse.Cloud.afterSave('Vote', function(request) {

	var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("username", "berlinLuke");

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
