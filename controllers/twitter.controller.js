const User   = require('../models/users.models');
const Follow   = require('../models/users.models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cookie = require('cookie');
var session = require('express-session');
//process.env.SECRET_KEY="mihir123";
let TempMail;
let TempUser;

exports.registerGet = function(req, res) {
  if(req.session.sessToken !== undefined) {
    res.redirect('./home');
  }
  else{
    res.render('register');
  }

}

exports.registerPost = async function(req, res) {
  let username =  req.body.uname;
  let name =  req.body.name;
  let email =  req.body.email;
  let pw =  req.body.pw;

  console.log(">>>",username);
  console.log(">>>",name);
  console.log(">>>",email);
  console.log(">>>",pw);

  let newUser = new User({
    name: username,
    username: name,
    email: email,
    password: pw,
  });


  let checkUser = await User.getUser({ $or : [ { username: username }, { email : email} ] });

  if(checkUser) {
    console.log("try different username and email");
    res.render('register');
  } else {
    let user = User.createUser(newUser,function(err,userInfo){
      if (err) {
        console.log(err)
      }
      if(userInfo){

        res.render('login');
      }
    })
  }
}


exports.loginGet = function(req, res) {
  if(req.session.sessToken !== undefined) {
    res.redirect('/home');
  }else{
    res.render('login');
  }

}

exports.loginPost = async function(req, res) {
  let uname =  req.body.uname;
  let pw =  req.body.pw;
  let sess = req.session;
  console.log(sess);
  let user = await User.getUser( { username: uname }  );
  // console.log(">>>>>>",user);
  if(bcrypt.compareSync(pw, user.password)) {

    let token = jwt.sign({ username : user.username , email : user.email }, 'SECRETKEY',{ expiresIn : 5000  });
    sess.sessToken = token;
    sess.uname = uname;
    sess._id = user._id;

   // console.log(">>>",sess.sessToken)
    res.cookie('token',token ).redirect('/home');

  } else {
    console.log("username or pw incorrectt");
    //res.status(401).send({success: false, msg: 'Authentication failed. Wrong password.'});
    res.redirect('/login');
  }

}


exports.finduserGet = function(req, res) {
  res.render('finduser');
}

exports.finduserPost = async function(req, res) {

  TempUser = req.body.uname;
  TempMail = req.body.email;
  let user = await User.getUser({ $and : [ { username: TempUser }, { email : TempMail} ] });
  //  let user = await User.updateUser( { email : mail } , { $set : { password : pw } });
  console.log(user);
  if(user){
    res.render("resetpw");
  }else{
    res.render("finduser");
    //res.send(alert("Usernot found"))
  }
}

exports.resetpwGet = function(req, res) {
  res.render('resetpw');
}

exports.resetpwPost = async function(req, res) {

  let pw = req.body.pw;
  let confirmpw = req.body.confirmpw;
  if(pw == confirmpw){
    let user = await User.updateUser( { email : TempMail } , { $set : { password : confirmpw } });
    console.log(user);
    res.redirect("./login");
  }else{
    res.send("plz enter same pw on both textfield");
  }
}

exports.logout = function(req, res) {
  console.log("session destroy>>>>>");
  req.session.destroy();
  res.redirect('/login');
};




