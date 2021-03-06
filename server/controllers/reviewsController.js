var db = require('../db/config');
var bluebird = require('bluebird');
var url = require('url');

var User = require('../db/models/user');
var Users = require('../db/collections/users');
var Review = require('../db/models/review');
var Reviews = require('../db/collections/reviews');
var UserConnection = require('../db/models/userConnection');
var UserConnections = require('../db/collections/userConnections');

module.exports = {

  handleReviews: {
    get: function(req, res) {
      var userId = url.parse(req.url).query.split('=')[1];

      Review.forge().where({user_id: userId}).fetchAll()
        .then(function(model) {
        // see user database model 
        console.log(model);
        res.status(200).send(model);
      });
    },
    post: function(req, res) {
      var userId = url.parse(req.url).query.split('=')[1]; // url format: /friends/getFriendList?user_id=123

      console.log("*************Review*************");
      console.log(userId);
      console.log(req.body);

      var newReview = new Review({
        user_id: userId,
        longitude: req.body.longitude,
        latitude: req.body.latitude,
        google_loc_name: req.body.name
      });

      console.log(newReview);

      newReview.fetch().then(function(found) {
        reviewWithText = new Review({
          user_id: userId,
          longitude: req.body.longitude,
          latitude: req.body.latitude,
          google_loc_name: req.body.name,
          review_text: req.body.reviewText
        });
        // if this user has already reviewed this place
        if (found) {
          // TODO: alert user they have an old review
          //remove old review
          found.destroy().then(function(review) {
            Reviews.remove(review);
            console.log('overwritten!');
          });
        } 
        // write the review
        reviewWithText.save().then(function(review) {
          // newReview.add(review);
          // Send back friend so that client can add to friendList?
          res.status(200).send(review);
        });

      });

    }
  },





};