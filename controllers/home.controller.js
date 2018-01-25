const User   = require('../models/users.models');
const session = require('express-session');
const fs = require('fs');
const Follower   = require('../models/follow.models');
const following   = require('../models/users.models');


exports.homeGet = function (req, res) {
    res.render('home');
}

exports.showProfileGet = async function(req,res){
   let checkUser = await User.getUser( { username : req.session.uname } );

   let followercount = await Follower.getFollowers({ following : req.session.uname, status : true});
   let followingcount = await Follower.getFollowers({ username : req.session.uname, status : true});

   res.render('showProfile',
    { checkUser : checkUser,
      followercount : followercount,
      followingcount:followingcount
    });
}


exports.profileGet =async function(req,res){
   let checkUser = await User.getUser( {
     username : req.session.uname
    } );
   res.render('profile',{ checkUser : checkUser});

}

exports.profilePost = async function(req,res){
  let img =  req.files;
  let name =  req.body.name;
  let email =  req.body.email;
  let pw =  req.body.pw;

  let checkUser =await User.getUser( { email : email } );

  let updatePro = await User.updateProfile(
    {
      username : req.session.uname
    },name,img,pw,email);
  res.redirect('/showProfile');

}

