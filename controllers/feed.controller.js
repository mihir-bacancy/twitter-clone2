const Feed = require('../models/feed.models');
const session = require('express-session');

exports.createTweetPost = function(req,res) {
  let username = req.session.uname;
  let tweet = req.body.tweet;

  let newTweet = new Feed({
    username : username,
    tweet : tweet,
  });

  let createTweet = Feed.createTweet(newTweet,function(err,NewTweet) {
    if (err) {
      console.log(err);
    }
    console.log("Tweet Created");
    res.send(newTweet.tweet)
  });
}
