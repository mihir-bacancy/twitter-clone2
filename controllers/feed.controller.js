const Feed = require('../models/feed.models');
const User = require('../models/users.models');

//Create Tweet
exports.createTweetPost = async function (req, res) {
  let username = req.session.uname;
  let tweet = req.body.tweet;

  let newTweet = new Feed({
    username: username,
    tweet: tweet
  });

  let getUserProfileCard = await User.getUser(
    { username: req.session.uname});

  let createTweet = Feed.createTweet(newTweet, function (err, NewTweet) {
    if (err) {
      console.log(err);
    }
    res.send({tweet: newTweet.tweet, getUserProfileCard: getUserProfileCard});
  });
};

// Liker perticular post
exports.likePost = async function (req, res) {
  let _id = req.body._id;
  let liker = req.session.uname;
  let likeTweet = await Feed.like(
    {
      _id: _id
    },
    {
				 $push:
				{
					 likes: {liker: liker, status: 'liked'}
				}
    }
	 );
  let likercount = await Feed.getLiker({_id: _id});

  if (likeTweet) {
    res.send({likercount: likercount.likes.length});
  }
};

// Unlike tweet
exports.unLikePost = async function (req, res) {
  let _id = req.body._id;
  let liker = req.session.uname;

  let unLikeTweet = await Feed.unLike(
    {
      _id: _id
    },
    {
      $pull:
				{
				  likes: {
				    liker: liker,
				    status: 'liked'
				  }
				}
    });

  let likercount = await Feed.getLiker({_id: _id});

  if (unLikeTweet) {
    res.send({likercount: likercount.likes.length});
  }
};

// Update Tweet
exports.editTweetPost = async function (req, res) {
  let editTweet = await Feed.updateTweet({_id: req.body.id}, {$set: { tweet: req.body.EditedTweet }});
  let getupdatedTweet = await Feed.getTweet({_id: req.body.id});
  if (editTweet) {
    res.send(getupdatedTweet);
  }
};
