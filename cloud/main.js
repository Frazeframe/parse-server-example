
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
    		var PhotoClass = Parse.Object.extend("Photo");
				var photoQuery = new Parse.Query(PhotoClass);
				photoQuery.get(request.params.photo, {
				  success: function(photo) {
				    // The object was retrieved successfully.
				  },
				  error: function(object, error) {
				    // The object was not retrieved successfully.
				    // error is a Parse.Error with an error code and message.
				  }
				});

    		// var vote = results[0];


    		// response.success(vote);

    	}
    	else {
    		response.error("An error occured when searching for the vote.");
    	}
    },
    error: function() {
    	voteWeight = request.params.voteWeight
    	if (voteWeight == 1 || voteWeight == -1) {
    		var PhotoClass = Parse.Object.extend("Photo");
				var photoQuery = new Parse.Query(PhotoClass);
				photoQuery.get(request.params.photo, {
				  success: function(photo) {
				  	photo.increment("totalVotes", voteWeight);
				  	photo.save();

				    var VoteClass = Parse.Object.extend("Vote");
						var newVote = new VoteClass();

						newVote.save({
						  weight: request.params.voteWeight,
						  photo: photo
						}, {
						  success: function(newVote) {
						    response.success(newVote);
						  },
						  error: function(newVote, error) {
						    response.error("There was an error saving the vote.");
						  }
						});
				  },
				  error: function(object, error) {
				    response.error("Could not find photo.");
				  }
				});
    	}
    	else {
    		response.error("Invalid vote weight. Must be 1 for up vote or -1 for down vote.");
    	}
    }
  });
});
