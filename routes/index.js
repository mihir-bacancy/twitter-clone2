const express = require('express');
const router = express.Router();
let multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req,  file,  cb) {
    cb(null,  'public/images/')
  },
  path: function (req,  file,  cb) {
    cb(null,  file.path)
  },
  filename: function (req,  file,  cb) {
    cb(null,  file.originalname)
  }
})

var upload = multer({ storage: storage })
const twitterController = require('../controllers/twitter.controller.js')
const homeController = require('../controllers/home.controller.js')
const searchFriendController = require('../controllers/SearchFriend.controller.js')
const feedController = require('../controllers/feed.controller.js')


//router.get('/',  testController.test);
router.get('/login',  twitterController.loginGet);
router.post('/login',  twitterController.loginPost);
router.get('/register',  twitterController.registerGet);
router.post('/register',  twitterController.registerPost);
router.get('/finduser',  twitterController.finduserGet);
router.post('/finduser',  twitterController.finduserPost);
router.get('/resetpw',  twitterController.resetpwGet);
router.post('/resetpw',  twitterController.resetpwPost);
router.get('/logout',  twitterController.logout);
router.get('/home', isAuthenticated , homeController.homeGet);
router.get('/editprofile', isAuthenticated, homeController.profileGet);
router.post('/profile', upload.any(), homeController.profilePost);
router.get('/showProfile', isAuthenticated, homeController.showProfileGet);


router.get('/searchFriend', searchFriendController.searchFriendGet);
router.post('/searchFriend', searchFriendController.searchFriendPost);
router.get('/showFriendProfile', searchFriendController.showFriendProfileGet);
router.post('/follow', searchFriendController.unfollowPost);
router.post('/unfollow', searchFriendController.followPost);

router.post('/createTweet', feedController.createTweetPost);

// router.get('/', homeController.demoGet);

router.post('/following', searchFriendController.getFollowingListPost);
router.post('/follower', searchFriendController.getFollowerListPost);

router.post('/getTweet', searchFriendController.getTweetPost);
router.post('/getFriendTweets', searchFriendController.getFriendTweetPost);

router.post('/like', feedController.likePost);
router.post('/unLike', feedController.unLikePost);

router.post('/editTweet', feedController.editTweetPost);

module.exports = router;

function isAuthenticated(req,  res,  next) {
  if (req.session.sessToken || req.session.uname) {
    return next();
  }else{
    res.redirect('/login');
    console.log("not authentication");
  }
}
