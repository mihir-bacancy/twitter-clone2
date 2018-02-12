const Feed = require('../models/feed.models')
const User = require('../models/users.models')
const session = require('express-session')

exports.createTweetPost = async function (req, res) {
  let username = req.session.uname
  let tweet = req.body.tweet

  console.log('>_______________', tweet)

  let newTweet = new Feed({
    username: username,
    tweet: tweet
  })

  let getUserProfileCard = await User.getUser(
    { username: req.session.uname})

  let createTweet = Feed.createTweet(newTweet, function (err, NewTweet) {
    if (err) {
      console.log(err)
    }
    console.log('Tweet Created')
    res.send({tweet: newTweet.tweet, getUserProfileCard: getUserProfileCard})
  })
}

// Liker perticular post
exports.likePost = async function (req, res) {
  let _id = req.body._id
  let liker = req.session.uname
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

  )

  let likercount = await Feed.getLiker({_id: _id})

  if (likeTweet) {
    res.send({likercount: likercount.likes.length})
  }
}

// Unlike tweet
exports.unLikePost = async function (req, res) {
  let _id = req.body._id
  let liker = req.session.uname

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
    })

  let likercount = await Feed.getLiker({_id: _id})

  if (unLikeTweet) {
    res.send({likercount: likercount.likes.length})
  }
}

exports.editTweetPost = async function (req, res) {
  console.log('  >>  >>>>>>>>>>>>>>>>>>>', req.body)
  let editTweet = await Feed.updateTweet({_id: req.body.id}, {$set: { tweet: req.body.EditedTweet }})
  console.log('<><><><><> ', editTweet)
  let getupdatedTweet = await Feed.getTweet({_id: req.body.id})
  console.log(getupdatedTweet)

  if (editTweet) {
    console.log(getupdatedTweet)
    res.send(getupdatedTweet)
  }
}
