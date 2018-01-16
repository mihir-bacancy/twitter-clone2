const express = require('express');
const router = express.Router();

const twitterController = require('../controllers/twitter.controller.js')

//router.get('/', testController.test);
router.get('/login', twitterController.loginGet);
router.post('/login', twitterController.loginPost);
router.get('/register', twitterController.registerGet);
router.post('/register', twitterController.registerPost);
router.get('/finduser', twitterController.finduserGet);
router.post('/finduser', twitterController.finduserPost);
router.get('/resetpw', twitterController.resetpwGet);
router.post('/resetpw', twitterController.resetpwPost);
module.exports = router;

