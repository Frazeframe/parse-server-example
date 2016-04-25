Parse.Cloud.afterSave('Vote', function(request) {
	Parse.cloud.useMasterkey();

	var pushQuery = new Parse.Query(Parse.Installation);
  pushQuery.equalTo("username", "berlinluke");

	Parse.Push.send({
	  where: pushQuery,
	  data: {
	    alert: 'Test',
	    badge: 1,
	    sound: 'default'
	  }
	}, {
	  useMasterKey: true,
	  success: function() {
	    // Push sent!
	  },
	  error: function(error) {
	    // There was a problem :(
	  }
	});
});
