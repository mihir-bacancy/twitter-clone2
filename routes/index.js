const express = require('express');
const router = express.Router();
var multer  = require('multer')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

var upload = multer({ storage: storage })
const twitterController = require('../controllers/twitter.controller.js')
const homeController = require('../controllers/home.controller.js')
const searchFriendController = require('../controllers/SearchFriend.controller.js')

//router.get('/', testController.test);
router.get('/login', twitterController.loginGet);
router.post('/login', twitterController.loginPost);
router.get('/register', twitterController.registerGet);
router.post('/register', twitterController.registerPost);
router.get('/finduser', twitterController.finduserGet);
router.post('/finduser', twitterController.finduserPost);
router.get('/resetpw', twitterController.resetpwGet);
router.post('/resetpw', twitterController.resetpwPost);
router.get('/logout', twitterController.logout);
//router.post('/jwtauthenticate', twitterController.jwtauthenticatePost);
router.get('/home',isAuthenticated ,homeController.homeGet);
router.get('/profile',isAuthenticated,homeController.profileGet);
router.post('/profile',upload.any(),homeController.profilePost);
router.get('/showProfile',isAuthenticated,homeController.showProfileGet);


router.get('/searchFriend',searchFriendController.searchFriendGet);
router.post('/searchFriend',searchFriendController.searchFriendPost);
router.get('/showFriendProfile',searchFriendController.showFriendProfileGet);
router.post('/follow',searchFriendController.followPost);
router.post('/unfollow',searchFriendController.unfollowPost);



//router.get('/showFriendResult',homeController.showFriendResultPost);
//router.get('/showFriendProfile',isAuthenticated,homeController.showFriendProfilePost);

module.exports = router;

// router.get('/showFriendResult',homeController.showFriendResultGet);
// router.post('/showFriendResult',homeController.showFriendResultPost);





// router.post('/testAjax', function(req, res) {
//   console.log(".......", req.body);
//   res.send("its working");
// })


function isAuthenticated(req, res, next) {
  if (req.session.sessToken || req.session.uname){

    console.log("<<<<<   authentication  >>>>>")
    return next();

  }else{
    res.redirect('/login');
    console.log(" not authentication")
  }
}
