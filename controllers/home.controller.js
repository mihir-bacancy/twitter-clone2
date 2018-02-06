const User   = require('../models/users.models');
const session = require('express-session');
const Feed = require('../models/feed.models');
const Follower   = require('../models/follow.models');
const following   = require('../models/users.models');

const fs = require('fs');

exports.homeGet = async function (req, res) {

  let followingList = await Follower.getFollowingList(
                  { username : req.session.uname, status : true});
  let getUserProfileCard = await User.getUser(
                  { username : req.session.uname} );
  let followercount = await Follower.getFollowersCount(
                  { following : req.session.uname, status : true});
  let followingcount = await Follower.getFollowersCount(
                  { username : req.session.uname, status : true});
  let getTweetCount = await Feed.getTweetCount(
                  {username : req.session.uname});

  let getTweets = [];
  let getUser;
  let getTweetsByDate = [];
  let getAllTweets = [];
  let dateTemp;

  for(let k = 0;k < followingList.length; k++) {
    getTweets = await Feed.getTweet (
      {username:followingList[k].following});

    getUser = await User.getUser( { username : followingList[k].following } );

    for (let count=getTweets.length-1; count >= 0 ; count--) {
      getTweets[count].path = getUser.img;
      getTweets[count].name = getUser.name;
      dateTemp = formatDate(getTweets[count].createdAt);
      getTweets[count].date = dateTemp;
      getAllTweets.push(getTweets[count]);
    }
  }

  getAllTweets.sort((a,b) => {
    if(a.createdAt > b.createdAt)
      return 1;
    else if (a.createdAt < b.createdAt)
      return -1;
    else
      return 0;
  })

  // console.log(">>>",getAllTweets.likes['test2']);
  res.render('home',{
    tweet : getAllTweets,
    getUser:getUser,
    getUserProfileCard : getUserProfileCard,
    followercount : followercount,
    followingcount : followingcount,
    getTweetCount : getTweetCount,
  });
}

//Show Your own Profile
exports.showProfileGet = async function(req,res) {
   let checkUser = await User.getUser( { username : req.session.uname } );

   let followercount = await Follower.getFollowersCount(
                      { following : req.session.uname, status : true});
   let followingcount = await Follower.getFollowersCount(
                      { username : req.session.uname, status : true});
   let getTweets = await Feed.getTweet(
                      {username : req.session.uname});
   let getTweetCount = await Feed.getTweetCount(
                      {username : req.session.uname});
   console.log(">>>>>>>>>>..>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",getTweets);

   res.render('showProfile',
    { checkUser : checkUser,
      followercount : followercount,
      followingcount:followingcount,
      getTweets : getTweets,
      getTweetCount : getTweetCount,
    });
}

// Render on edit profile
exports.profileGet =async function(req,res) {
   let checkUser = await User.getUser( {
     username : req.session.uname
    } );
   res.render('editprofile',{ checkUser : checkUser});

}

// submit and save edited profile
exports.profilePost = async function(req,res) {

  let name =  req.body.name;
  let email =  req.body.email;
  let pw =  req.body.pw;
  let img;

  let checkUser =await User.getUser( { email : email } );
  console.log("img",checkUser.img);
  if (req.files.length == 0) {
    img = checkUser.img;
    let updatePro = await User.updateProfile(
    {
      username : req.session.uname
    },name,img,pw,email);

  } else {
    img = req.files[0].path.replace("public","");
    let updatePro = await User.updateProfile(
    {
      username : req.session.uname
    },name,img,pw,email);

  }


  res.redirect('/showProfile');

}


// To put tweet time in proper format
function formatDate(dateFrom) {

  let monthNames = ["Jan", "Feb", "March", "Apr", "May", "June",
  "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];

    let d = new Date(dateFrom),
        month =  monthNames[d.getMonth() + 1  ],
        day = d.getDate(),
        year = d.getFullYear(),
        hrs = d.getHours(),
       min = d.getMinutes();

    let date = day +" "+ month +" "+ year +"   "+hrs+":"+min;
    return date;
}
