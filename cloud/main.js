
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('voteOnPhoto', function(request, response) {
	var query = new Parse.Query("Vote");
  query.equalTo("createdBy", request.params.createdBy);
  query.equalTo("photo", request.params.photo);

  query.first({
    success: function(result) {
      response.success(result);
    },
    error: function() {
      response.error("Vote lookup failed");
    }
  });
});
