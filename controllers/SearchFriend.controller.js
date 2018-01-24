const User = require('../models/users.models');
const session = require('express-session');
const fs = require('fs');
const Follower   = require('../models/follow.models');

exports.searchFriendGet = function(req,res){
  res.render('searchFriend');
}

exports.searchFriendPost = async function(req,res){
  Query = req.body.search;
  let users = await User.searchUser({ name: Query });
  if(users){
    res.send(users);
  }else{
    res.send("no user found");
  }

}

exports.showFriendProfileGet = async function(req,res){
  let username = req.query.id;
  let status;
   if(username != null) {
    username = username.replace("\'","");
    username = username.replace("\'","");
   }

   let checkFollowStatus = await Follower.checkFollow( { $and : [ { username : req.session.uname },{ following : username }]})
    console.log("checkFollow:", checkFollowStatus);
    if(checkFollowStatus){

      if(checkFollowStatus.status === false){
        status = "follow";
      }else{
        status = "unfollow"
      }
    }

  console.log("Status>>>>>>>>>>>>>>>>",status);
  let checkUser = await User.getUser( { username  : username } );
  res.render('showFriendProfile', {
    checkUser : checkUser,username : req.session.uname,
    status : status
  });
}



exports.followPost =async function(req, res) {
  let myUsername =  req.body.myUsername;
  let friendUsername =  req.body.friendUsername;
  console.log("myUsername",myUsername)
  console.log("friendUsername",friendUsername)

  console.log("============FollowingUser==============",req.body);

  let newFollower = new Follower({
    username: req.session.uname,
    following: friendUsername,
    status: true,
  });
  let checkFollowStatus = await Follower.checkFollow( { $and : [ { username : req.session.uname },{ following : friendUsername }]})
  console.log(":::::::::",checkFollowStatus);
   if(checkFollowStatus !== null){
      let unfollowFriend = await Follower.updateFollow({$and:[{username:myUsername},
                            {following:friendUsername}]},{$set:{status:false}});
      res.send("already following");
   }else{
    let followInsert = await Follower.follow(newFollower,function(err,userInfo){
      if (err) {
        console.log(err)
      }
      if(userInfo){
        res.send('Done');
      }
    });

  }


}

exports.unfollowPost =async function(req, res) {
  let myUsername =  req.body.myUsername;
  let friendUsername =  req.body.friendUsername;

  console.log("?????", myUsername,
  friendUsername)

  console.log("===========unfollowPost==============",req.body);

  let unfollowFriend = await Follower.updateFollow({$and:[{username:myUsername},
                            {following:friendUsername}]},{$set:{status:true}});



res.send("unfollowFrien success")

}

