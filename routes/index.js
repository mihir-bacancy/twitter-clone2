const express = require('express');
const router = express.Router();
let multer = require('multer');
const passport = require('passport');
const LocalStrategy = require("passport-local").Strategy;

const User = require('../models/users.models');

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/');
  },
  path: function (req, file, cb) {
    cb(null, file.path);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

let upload = multer({ storage: storage });
const twitterController = require('../controllers/twitter.controller.js');
const homeController = require('../controllers/home.controller.js');
const searchFriendController = require('../controllers/SearchFriend.controller.js');
const feedController = require('../controllers/feed.controller.js');



router.get('/', homeController.homeGet);
router.get('/login', twitterController.loginGet);
// router.post('/login', twitterController.loginPost);
router.get('/register', twitterController.registerGet);
router.post('/register', twitterController.registerPost);
router.get('/verify', twitterController.verifyGet);
router.get('/finduser', twitterController.finduserGet);
router.post('/finduser', twitterController.finduserPost);
router.get('/resetpw', twitterController.resetpwGet);
router.post('/resetpw', twitterController.resetpwPost);
router.get('/logout', twitterController.logout);
router.get('/home', ensureAuthenticated,homeController.homeGet);
router.get('/editprofile', ensureAuthenticated, homeController.profileGet);
router.post('/profile', upload.any(), homeController.profilePost);
router.get('/showProfile', ensureAuthenticated, homeController.showProfileGet);

router.get('/searchFriend', ensureAuthenticated, searchFriendController.searchFriendGet);
router.post('/searchFriend', searchFriendController.searchFriendPost);
router.get('/showFriendProfile', ensureAuthenticated, searchFriendController.showFriendProfileGet);
router.post('/follow', ensureAuthenticated, searchFriendController.unfollowPost);

// For Follow user.
router.post('/unfollow', ensureAuthenticated, searchFriendController.followPost);

router.post('/createTweet', ensureAuthenticated, feedController.createTweetPost);

// router.get('/', homeController.demoGet);

router.post('/following', ensureAuthenticated, searchFriendController.getFollowingListPost);
router.post('/follower', ensureAuthenticated, searchFriendController.getFollowerListPost);

router.post('/getTweet', ensureAuthenticated, searchFriendController.getTweetPost);
router.post('/getFriendTweets', ensureAuthenticated, searchFriendController.getFriendTweetPost);

router.post('/like', ensureAuthenticated, feedController.likePost);
router.post('/unLike', ensureAuthenticated, feedController.unLikePost);

router.post('/editTweet', ensureAuthenticated, feedController.editTweetPost);




router.post('/login',

  passport.authenticate('local',
    {
      successRedirect: '/home',
      failureRedirect: '/login',
      failureFlash: true,
    }
  )
);



module.exports = router;

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else {
    res.redirect('/login');
  }
}

