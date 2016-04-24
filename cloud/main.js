
Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('voteOnPhoto', function(request, response) {
	var query = new Parse.Query("Vote");
  query.equalTo("createdBy", request.params.user);
  query.equalTo("photo", request.params.photo);

  query.find({
    success: function(results) {
      response.success(results);
    },
    error: function() {
      response.error("Vote lookup failed");
    }
  });
});
