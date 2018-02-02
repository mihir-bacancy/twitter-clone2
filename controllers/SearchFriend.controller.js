const User = require('../models/users.models');
const session = require('express-session');
const fs = require('fs');
const Follower   = require('../models/follow.models');
const Feed = require('../models/feed.models');

exports.searchFriendGet = function(req,res) {
	res.render('searchFriend');
}

// Search User to follow
exports.searchFriendPost = async function(req,res) {
	Query = req.body.search;
	let users = await User.searchUser({ name: Query });
	if (users) {
		res.send(users);
	}else{
		res.send("no user found");
	}
}

//Get other user's profile information like tweet,follower,following
exports.showFriendProfileGet = async function(req,res) {
	let friendUsername = req.query.id;
	let status= "follow";

	 if (friendUsername != null) {
		friendUsername = friendUsername.replace("\'","");
		friendUsername = friendUsername.replace("\'","");
	 }

	 let checkFollowStatus = await Follower.checkFollow(
		{
			$and :
			[
				{
					username : req.session.uname
				},
				{
					following : friendUsername
				}
			]
		})

		if (checkFollowStatus) {
			if (checkFollowStatus.status === false) {
				status = "follow";
			}else{
				status = "unfollow"
			}
		} else {
			let newFollower = new Follower({
				username: req.session.uname,
				following: friendUsername,
				status: true,
			});

			let followInsert = await Follower.follow(newFollower,function(err,userInfo) {
				if (err) {
					console.log(err);
				}
				if (userInfo) {
					status = "follow";

				}
			});
		}

		let getFriendTweets = await Feed.getTweet({username : friendUsername});

		let followingList = await Follower.getFollowingList
									({ username : req.session.uname, status : true});
		let checkUser = await User.getUser( { username  : friendUsername } );

		res.render('showFriendProfile', {
		checkUser : checkUser,username : req.session.uname,
		status : status,
		getFriendTweets : getFriendTweets,
	});
}

//Follow other user
exports.followPost = async function (req, res) {
	let myUsername =  req.body.myUsername;
	let friendUsername =  req.body.friendUsername;

	let newFollower = new Follower ({
		username: req.session.uname,
		following: friendUsername,
		status: true,
	});

	let checkFollowStatus = await Follower.checkFollow (
			{ $and : [ { username : req.session.uname },{ following : friendUsername }]})

	if (checkFollowStatus !== null) {
		let unfollowFriend = await Follower.updateFollow({$and:[{username:myUsername},
														{following:friendUsername}]},{$set:{status:false}});
		res.send("already following");
	} else {
		let followInsert = await Follower.follow(newFollower,function(err,userInfo) {
			if (err) {
				console.log(err)
			}

			if (userInfo) {
				res.send('Done');
			}

		});
	}
}

//Unfollow friends
exports.unfollowPost =async function(req, res) {
	let myUsername =  req.body.myUsername;
	let friendUsername =  req.body.friendUsername;
	let unfollowFriend = await Follower.updateFollow({$and:[{username:myUsername},
														{following:friendUsername}]},{$set:{status:true}});
	res.send("unfollowFrien success")
}

//Get Followinglist for logged in user
exports.getFollowingListPost = async function(req,res) {
	let followingList = await Follower.getFollowingList(
								{ username : req.session.uname, status : true});

	if (followingList == null) {
		res.send("newFollowing");
	} else {
		res.send(followingList);
	}

}

//Get Followerlist for logged in user
exports.getFollowerListPost = async function(req,res) {
	let followerList = await Follower.getFollowingList(
									{ following : req.session.uname, status : true});

	if (followerList == null) {
		res.send("newFollowing");
	} else {
		res.send(followerList);
	}

}

//Get Tweet for loggedin user
exports.getTweetPost = async function (req,res) {
	let getTweets = await Feed.getTweet({username : req.session.uname});
	// console.log("<<<<  followerList  >>>>",followerList);
	//console.log("+++++",followingList)
	if (getTweets == null) {
		res.send("newFollowing");
	} else {
		res.send(getTweets);
	}

}

//get tweet of otherusers
exports.getFriendTweetPost = async function(req,res) {
	let friendUsername = req.body.friendUsername;
	let getFriendTweets = await Feed.getTweet({username : friendUsername});
	res.send(getFriendTweets)
}



