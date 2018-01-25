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
  let friendUsername = req.query.id;
  let status= "follow";
   if(friendUsername != null) {
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

    if(checkFollowStatus){
      if(checkFollowStatus.status === false){
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

      let followInsert = await Follower.follow(newFollower,function(err,userInfo){
        if (err) {
          console.log(err);
        }
        if(userInfo){
          status = "follow";

        }
      });
    }


  let checkUser = await User.getUser( { username  : friendUsername } );
  res.render('showFriendProfile', {
    checkUser : checkUser,username : req.session.uname,
    status : status
  });
}



exports.followPost =async function(req, res) {
  let myUsername =  req.body.myUsername;
  let friendUsername =  req.body.friendUsername;


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




  let unfollowFriend = await Follower.updateFollow({$and:[{username:myUsername},
                            {following:friendUsername}]},{$set:{status:true}});



res.send("unfollowFrien success")

}

