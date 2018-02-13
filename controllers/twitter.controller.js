const User = require('../models/users.models');
const Follower = require('../models/follow.models');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let TempMail;
let TempUser;

exports.registerGet = function (req, res) {
  if (req.session.sessToken !== undefined) {
    res.redirect('./home');
  } else {
    res.render('register');
  }
};

exports.registerPost = async function (req, res) {
  let username = req.body.uname;
  let name = req.body.name;
  let email = req.body.email;
  let pw = req.body.pw;

  let newUser = new User({
    name: name,
    username: username,
    email: email,
    password: pw,
    img: '/images/defaultprofile.png'
  });

  let newFollower = new Follower({
    username: name,
    following: name,
    status: true
  });

  let checkUser = await User.getUser(
    {
      $or:
      [
        {
          username: username
        },
        {
          email: email
        }
      ]
    });

  if (checkUser) {
    res.render('register');
  } else {
    let user = User.createUser(newUser, async function (err, userInfo) {
      if (err) {
        console.log(err);
      }

      let followInsert = await Follower.follow(newFollower, function (err, userInfo) {
        if (err) {
          console.log(err);
        }
      });

      if (userInfo) {
        res.render('login');
      }
    });
  }
};

exports.loginGet = function (req, res) {
  if (req.session.sessToken !== undefined) {
    res.redirect('/home');
  } else {
    res.render('login');
  }
};

exports.loginPost = async function (req, res) {
  let uname = req.body.uname;
  let pw = req.body.pw;
  let sess = req.session;

  let user = await User.getUser(
    {
      username: uname
    });

  if (bcrypt.compareSync(pw, user.password)) {
    let token = jwt.sign(
      {
        username: user.username,
        email: user.email
      },
      'SECRETKEY', {
        expiresIn: 60000
      });
    sess.sessToken = token;
    sess.uname = uname;
    sess._id = user._id;

    console.log('>>>', sess.sessToken);
    res.cookie('token', token).redirect('/home');
  } else {
    console.log('username or pw incorrectt');
    res.redirect('/login');
  }
};

exports.finduserGet = function (req, res) {
  res.render('finduser');
};

exports.finduserPost = async function (req, res) {
  TempUser = req.body.uname;
  TempMail = req.body.email;
  let user = await User.getUser(
    {
      $and:
      [
        {
          username: TempUser
        },
        {
          email: TempMail
        }
      ]
    });

  console.log(user);
  if (user) {
    res.render('resetpw');
  } else {
    res.render('finduser');
  }
};

exports.resetpwGet = function (req, res) {
  res.render('resetpw');
};

exports.resetpwPost = async function (req, res) {
  let pw = req.body.pw;
  let confirmpw = req.body.confirmpw;
  let hashconfirmpw;

  if (pw == confirmpw) {
    bcrypt.hash(confirmpw, 10, async function (err, hash) {
      hashconfirmpw = hash;
      let user = await User.updateUser(
        {
          email: TempMail
        },
        {
          $set:
        {
          password: hashconfirmpw
        }
        });
    });
    res.redirect('./login');
  } else {
    res.send('plz enter same pw on both textfield');
  }
};

exports.logout = function (req, res) {
  console.log('session destroy>>>>>');
  req.session.destroy();
  res.redirect('/login');
};
