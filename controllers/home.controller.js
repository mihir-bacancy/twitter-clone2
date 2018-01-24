const User   = require('../models/users.models');
const session = require('express-session');
const fs = require('fs');
const Follower   = require('../models/follow.models');
const following   = require('../models/users.models');





exports.homeGet = function (req, res) {

  console.log("session>>>>>>",req.session.sessToken);
  console.log("cookies>>>>>>",req.cookies.token);
  //console.log(req.cookies.token);
  // if(req.cookies.token !== undefined && req.session.sessToken !== undefined ){
  //   console.log(">>>login successfully");
    res.render('home')
  // }else{
  //   console.log(">>>>login errorr");
  //   res.render('./login');

  // }

}
exports.showProfileGet = async function(req,res){
   let checkUser = await User.getUser( { username : req.session.uname } );
   console.log(">>",checkUser)
   console.log(">>",req.session.uname)
   let followercount = await Follower.getFollowers({ following : req.session.uname, status : true});
   let followingcount = await Follower.getFollowers({ username : req.session.uname, status : true});
  res.render('showProfile',{ checkUser : checkUser,followercount : followercount,followingcount:followingcount});
}


exports.profileGet =async function(req,res){
   let checkUser = await User.getUser( { username : req.session.uname } );
   console.log(">>",checkUser)
   console.log(">>",req.session.uname)
    //console.log("-------------------------------------",checkUser[0].img.path)
  res.render('profile',{ checkUser : checkUser});

}

exports.profilePost = async function(req,res){
  let img =  req.files;
  let name =  req.body.name;
  let email =  req.body.email;
  let pw =  req.body.pw;
  console.log('file>>>>>>>>>>',img);
  console.log('>>>>>>>>>>',name);
  console.log('>>>>>>>>>>',email);
  console.log('>>>>>>>>>>',pw);
  console.log('>>>>>>>>>>',req.session.uname);

  let checkUser =await User.getUser( { email : email } );
  console.log(">>>>>>>",checkUser.path)
  let updatePro = await User.updateProfile({username : req.session.uname},name,img,pw,email);
  res.redirect('/showProfile');

}

