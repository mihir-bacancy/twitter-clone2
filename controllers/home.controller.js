const User   = require('../models/users.models');


exports.homePost =  function (req, res) {
  // let uname =  req.body.uname;
  // let pw =  req.body.pw;
  console.log(">>>>>>>>>>>>>");
  console.log(req.cookie);
  // let user = await User.getUser({username: uname,password: pw});

  // console.log(user);
  // if(user){
  //   //res.redirect('/home');
  //   //res.redirect('home');
  //   console.log("user login succesful");
  // } else{
  //  // res.render('index',{ title : user});
  //   console.log("user not found"
  //       //res(new Error("User not found"));
  // }

}
