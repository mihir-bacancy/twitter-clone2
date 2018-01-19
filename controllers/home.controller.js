const User   = require('../models/users.models');
const session = require('express-session');
const fs = require('fs');





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

exports.profileGet =async function(req,res){
   let checkUser = await User.getUser( { username : req.session.uname } );
   console.log(">>",checkUser)
   console.log(">>",req.session.uname)
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
  console.log(">>>>>>>",checkUser)
  let updatePro = await User.updateProfile({username : req.session.uname},name,img,pw,email);
  res.redirect('/home');

}
