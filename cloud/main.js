
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('voteOnPhoto', function(request, response) {
	var query = new Parse.Query("Vote");
  query.equalTo("createdBy", request.params.createdBy);
  query.equalTo("photo", request.params.photo);

  query.find({
    success: function(results) {
    	if (results[0] != null) {
    		response.success(results[0]);
    	}
    	else {
    		response.success("Yay!");
    	}
    },
    error: function() {
    	if (error.code == 141) {
    		response.success("Yay!");
    	}
    	else {
    		response.error("An error occured when making the vote.");
    	}
    }
  });
});
