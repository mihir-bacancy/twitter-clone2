var User   = require('../models/users.models');

exports.home =  function (req, res) {
  // let uname =  req.body.uname;
  // let pw =  req.body.pw;


  // let user = await User.getUser({username: uname,password: pw});

  // console.log(user);
  // if(user){
  //   //res.redirect('/home');
  //   //res.redirect('home');
  //   console.log("user login succesful");
  // } else{
  //  // res.render('index',{ title : user});
  //   console.log("user not found");
  //       //res(new Error("User not found"));
  // }

}

exports.registerGet = function(req, res) {
  res.render('register');
}

exports.registerPost = async function(req, res) {
  let username =  req.body.uname;
  let name =  req.body.name;
  let email =  req.body.email;
  let pw =  req.body.pw;

  let newUser = new User({
    name : name,
    username: username,
    email:email,
    password: pw
  });

  let checkUser =await User.getUser({ $or : [ { username: username }, { email : email} ] });
  console.log(">>>>>>>",checkUser)
  if(checkUser) {
    console.log("try different username and email");
    res.render('register');
  } else {
    let user = User.createUser(newUser,function(err,userInfo){
      if (err) {
        console.log(err)
      }
      if(userInfo){
        console.log("User added  ---->",userInfo);
        res.render('login');
      }
    })
  }
}


exports.loginGet = function(req, res) {
  res.render('login');
}

exports.loginPost = async function(req, res) {
  let uname =  req.body.uname;
  let pw =  req.body.pw;


  let user = await User.getUser({ $and : [ { username: uname }, { password : pw} ] });



  if(user){
    console.log("login succesfull");
    res.render('home');
  }else{
    console.log("username or pw incorrectt");
    res.redirect('/login');

  }

}
