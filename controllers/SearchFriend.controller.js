const User = require('../models/users.models')
// const fs = require('fs')
const Follower = require('../models/follow.models')
const Feed = require('../models/feed.models')

exports.searchFriendGet = function (req, res) {
  res.render('searchFriend')
}

// Search User to follow
exports.searchFriendPost = async function (req, res) {
  let Query = req.body.search
  // { $regex: '\Query.*'} }
  let users = await User.searchUser({ name: { $regex: '.*' + Query + '.*'} })
  console.log('>>', users)
  if (users) {
    res.send(users)
  } else {
    res.send('no user found')
  }
}

// Get other user's profile information like tweet, follower, following
exports.showFriendProfileGet = async function (req, res) {
  let friendUsername = req.query.id
  let status = 'follow'

  if (friendUsername != null) {
    friendUsername = friendUsername.replace("\'", '')
    friendUsername = friendUsername.replace("\'", '')
  }

  if (friendUsername == req.session.uname) {
    res.redirect('/showProfile')
  }
  let checkFollowStatus = await Follower.checkFollow(
    {
      $and:
			[
			  {
			    username: req.session.uname
			  },
			  {
			    following: friendUsername
			  }
			]
    })

  if (checkFollowStatus) {
    if (checkFollowStatus.status === false) {
      status = 'follow'
    } else {
      status = 'unfollow'
    }
  } else {
    let newFollower = new Follower({
      username: req.session.uname,
      following: friendUsername,
      status: true
    })

    let followInsert = await Follower.follow(newFollower, function (err, userInfo) {
      if (err) {
        console.log(err)
      }
      if (userInfo) {
        status = 'follow'
      }
    })
  }

  let getFriendTweets = await Feed.getTweet({username: friendUsername})

  let followingList = await Follower.getFollowingList
  ({ username: req.session.uname, status: true})
  let checkUser = await User.getUser({ username: friendUsername })
  let followercount = await Follower.getFollowersCount
  ({ following: friendUsername, status: true})

	 let followingcount = await Follower.getFollowersCount
  ({ username: friendUsername, status: true})
  let getTweetCount = await Feed.getTweetCount({username: friendUsername})

  res.render('showFriendProfile', {
    checkUser: checkUser,
    username: req.session.uname,
    status: status,
    getFriendTweets: getFriendTweets,
    followercount: followercount,
    followingcount: followingcount,
    getTweetCount: getTweetCount
  })
}

// Follow other user
exports.unfollowPost = async function (req, res) {
  let myUsername = req.session.uname
  let friendUsername = req.body.friendUsername
  console.log('unFollow called')

  let newFollower = new Follower({
    username: req.session.uname,
    following: friendUsername,
    status: true
  })

  let checkFollowStatus = await Follower.checkFollow(
    { $and: [ { username: req.session.uname }, { following: friendUsername }]})

  if (checkFollowStatus !== null) {
    let unfollowFriend = await Follower.updateFollow({$and: [{username: myUsername},
      {following: friendUsername}]}, {$set: {status: false}})
    let followingcount = await Follower.getFollowersCount(
      { username: req.session.uname, status: true})
    res.send({followingcount: followingcount})
  } else {
    let followInsert = await Follower.follow(newFollower, function (err, userInfo) {
      if (err) {
        console.log(err)
      }

      if (userInfo) {
        res.send('unfollowPost')
      }
    })
  }
}

// follow friends
exports.followPost = async function (req, res) {
  let myUsername = req.session.uname
  let friendUsername = req.body.friendUsername

  let unfollowFriend = await Follower.updateFollow({$and: [{username: myUsername},
    {following: friendUsername}]}, {$set: {status: true}})

  let followingcount = await Follower.getFollowersCount(
    { username: req.session.uname, status: true})

  res.send({followingcount: followingcount})
}

// Get Followinglist
exports.getFollowingListPost = async function (req, res) {
  let followingList
  let getUser
  let status = ''
  let checkStatusBtn

  if (req.body.friendUsername == undefined) {
    followingList = await Follower.getFollowingList(
      { username: req.session.uname, status: true})
  } else {
    followingList = await Follower.getFollowingList(
      { username: req.body.friendUsername, status: true})
  }

  // check reverse status for Follower ( we are following them or not )
  for (let i = followingList.length - 1; i >= 1; i--) {
    checkStatusBtn = await Follower.checkFollow(
      { $and: [{	username: req.session.uname }, { following: followingList[i].following }]})

    getUser = await User.getUser({ username: followingList[i].following })

    if (checkStatusBtn == null) {
      status = 'follow'
    } else {
      if (checkStatusBtn.status == false) {
        status = 'follow'
      } else {
        status = 'unfollow'
      }
    }

    let tempObj = JSON.parse(JSON.stringify(followingList[i]))
    tempObj['img'] = getUser.img
    tempObj['name'] = getUser.name
    tempObj['statusbtn'] = status
    followingList[i] = tempObj
    followingList[i].img = getUser.img
  }

  if (followingList == null) {
    res.send('newFollowing')
  } else {
    res.send(followingList)
  }
}

// Get Followerlist
exports.getFollowerListPost = async function (req, res) {
  let followerList
  let getUser
  let status = ''
  let checkStatusBtn
  console.log('called...getFollowerListPost')
  if (req.body.friendUsername == undefined) {
    followerList = await Follower.getFollowingList(
      { following: req.session.uname, status: true})
  } else {
    followerList = await Follower.getFollowingList(
      { following: req.body.friendUsername, status: true})
  }

  for (let i = followerList.length - 1; i >= 0; i--) {
    checkStatusBtn = await Follower.checkFollow(
      { $and: [{	username: req.session.uname }, { following: followerList[i].username }]})
    getUser = await User.getUser({ username: followerList[i].username })

    if (checkStatusBtn == null) {
      status = 'follow'
    } else {
      if (checkStatusBtn.status == false) {
        status = 'follow'
      } else {
        status = 'unfollow'
      }
    }

    let tempObj = JSON.parse(JSON.stringify(followerList[i]))
    tempObj['img'] = getUser.img
    tempObj['name'] = getUser.name
    tempObj['statusbtn'] = status
    followerList[i] = tempObj
    followerList[i].img = getUser.img
  }

  if (followerList == null) {
    res.send('newFollowing')
  } else {
    res.send(followerList)
  }
}

// Get Tweet for loggedin user
exports.getTweetPost = async function (req, res) {
  let getTweets = await Feed.getTweet({username: req.session.uname})
  if (getTweets == null) {
    res.send('newFollowing')
  } else {
    res.send(getTweets)
  }
}

// get tweet of otherusers
exports.getFriendTweetPost = async function (req, res) {
  let friendUsername = req.body.friendUsername
  let getFriendTweets = await Feed.getTweet({username: friendUsername})
  res.send(getFriendTweets)
}
