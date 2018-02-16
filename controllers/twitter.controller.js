const User = require('../models/users.models');
const cipher = require('../models/cipher.models');
const Follower = require('../models/follow.models');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var crypto = require('crypto');
let flash = require('express-flash');

let SECRETKEY = process.env.SECRETKEY;
let TempMail;
let TempUser;
let random, mailOptions, host, link;

exports.registerGet = function (req, res) {
	if (req.session.sessToken !== undefined) {
		res.redirect('/home');
	} else {
		req.flash('info', 'Welcome');
		console.log('>>');
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
		img: '/images/defaultprofile.png',
		status: false
	});

	let newFollower = new Follower({
		username: username,
		following: username,
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
	if (checkUser != null) {
		res.render('register');
	} else {
		// Create user
		let user = User.createUser(newUser, async function (err, userInfo) {
			if (err) {
				console.log(err);
			}
			if (userInfo !== null) {
				// if User created generatae cipher
				let tempUser = {
					username: userInfo.username,
					email: userInfo.email,
					tempcreatedAt: userInfo.createAt
				};

				cipher.createCipher(tempUser, function (err, cipherInfo) {
					if (err) {
						console.log(err);
					}

					link = 'http://' + req.get('host') + '/verify?vToken=' + cipherInfo.cipherText;

					mailOptions = {
						to: req.body.email,
						subject: 'Please confirm your Email account',
						html: 'Hello,<br> Please Click on the link to verify your email.' + link
					};
					console.log(mailOptions);

					// sending mail to created user
					smtpTransport.sendMail(mailOptions, function (error, response) {
						if (error) {
							console.log(error);
							res.end('error');
						} else {
							req.flash('info', 'mail has been send to ' + mailOptions.to + ' Please verify your account');
							res.render('login', {to: mailOptions.to});
						}
					});
				});
				// follow own by default
				let followInsert = await Follower.follow(newFollower, function (err, userInfo) {
					if (err) {
						console.log(err);
					}
				});
			} else {
				res.render('register');
			}
		});
	}
}

// verification of account ( email verification )
exports.verifyGet = async function (req, res) {
	// console.log('Domain is matched. Information is from Authentic email');
	let getCipher = await cipher.checkCipher({cipherText: req.query.vToken});

	if (req.query.vToken === getCipher.cipherText && getCipher.status === true) {
		let updatecipher = await cipher.updateCipher({cipherText: req.query.vToken},
			{$set: {status: false}});
		let updateuser = await User.updateUser({username: getCipher.username},
			{$set: {status: true}});
		req.flash('success', 'registration success. Please do login');
		res.render('login');
	} else {
		res.end('<h1>Token Expired</h1>');
	}
}

exports.loginGet = function (req, res) {
	if (req.user) {
		res.redirect('/home');
	} else {
		res.render('login');
	}
	console.log(req.user);

}

exports.loginPost = async function (req, res) {
	let uname = req.body.uname;
	let pw = req.body.pw;
	let sess = req.session;

	let user = await User.getUser(
		{
			username: uname
		});

	if (user.status === true) {
		if (bcrypt.compareSync(pw, user.password)) {
			let token = jwt.sign(
				{
					username: user.username,
					email: user.email
				},
				SECRETKEY, {
					expiresIn: 60000
				});
			sess.sessToken = token;
			sess.uname = uname;
			sess._id = user._id;

			res.cookie('token', token).redirect('/home');
		} else {
			res.redirect('/login');
		}
	} else {
		req.flash('info', 'Please Check your email and click on the link to verify your account');
		res.render('login');
	}
};

// Find user for reset pw get
exports.finduserGet = function (req, res) {
	res.render('finduser');
};

// Find user for reset pw post
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

	if (user) {
		res.render('resetpw');
	} else {
		res.render('finduser');
	}
};

exports.resetpwGet = function (req, res) {
	res.render('resetpw');
};

// reset pw and store in hash format
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

	req.flash('success','Logout successfull');
	req.session.destroy();
	res.redirect('/login');
};

let smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'Enter Email id',
		pass: 'Enter Password'
	}
});
