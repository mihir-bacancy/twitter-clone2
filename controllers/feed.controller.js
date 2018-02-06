const Feed = require('../models/feed.models');
const session = require('express-session');

exports.createTweetPost = function(req,res) {
  let username = req.session.uname;
  let tweet = req.body.tweet;

  console.log(">_______________",tweet);

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


exports.likePost = async function(req,res) {
  let _id = req.body._id;
  let liker = req.session.uname;

  console.log(">>>>",_id);


  let likeTweet = await Feed.like(
      {
        _id : _id
      } ,
      {
         $push :
        {
           likes : {liker: liker, status: 'liked'}
        }
      }

   );

  let likercount = await Feed.getLikerCount({_id : _id});
  console.log(likercount.likes.length)

  let status = "like";

  // console.log(">>>>      ",likesTweet);
  if (likeTweet) {
    res.send({likercount : likercount.likes.length});
  }
}


exports.unLikePost = async function(req,res) {
  let _id = req.body._id;
  let liker = req.session.uname;

  console.log(">>>>",_id);


  let unLikeTweet = await Feed.unLike(
      {
        _id : _id
      } ,
      {
        $pull :
        {
          likes : {
              liker : liker,
              status: "liked"
          }
        }
      });

  let likercount = await Feed.getLikerCount({_id : _id});
  let status = "unlike";

  // console.log(">>>>      ",likesTweet);
  if (unLikeTweet) {
    res.send({likercount : likercount.likes.length});
  }
}

