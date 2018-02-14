const User = require('../models/users.models');
const Follower = require('../models/follow.models');
var nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let TempMail;
let TempUser;
let  random, mailOptions, host, link;

exports.registerGet = function (req, res) {
	if (req.session.sessToken !== undefined) {
		res.redirect('/home');
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
				//send email for verification
				 random = Math.floor((Math.random() * 100) + 54);
				host = req.get('host');
				// console.log('Host ........', host);
				link = 'http://' + req.get('host') + '/verify?id=' +  random + '&un=' + userInfo.username;

				mailOptions = {
					to: req.body.email,
					subject: 'Please confirm your Email account',
					html: 'Hello,<br> Please Click on the link to verify your email.' + link
				};

				smtpTransport.sendMail(mailOptions, function (error, response) {
					if (error) {
						console.log(error);
						res.end('error');
					} else {
						res.render('index', {to: mailOptions.to});
					}
				});

			}
		});
	}
};

//verification of account ( email verification )
exports.verifyGet = async function (req, res) {
	if ((req.protocol + '://' + req.get('host')) == ('http://' + host)) {
		// console.log('Domain is matched. Information is from Authentic email');
		if (req.query.id ==  random) {
			console.log('email is verified');
			let user = await User.updateUser({ username: req.query.un}, {$set: {status: true}});
			res.render('login');
		} else {
			// console.log('email is not verified');
			res.end('<h1>Bad Request</h1>');
		}
	} else {
		res.end('<h1>Request is from unknown source');
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

	if (user.status === true) {
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

			res.cookie('token', token).redirect('/home');
		} else {
			res.redirect('/login');
		}
	} else {
		res.render('index');
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
	req.session.destroy();
	res.redirect('/login');
};

let smtpTransport = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'mihir.kanzariya@bacancytechnology.com',
		pass: 'Mihirkanzariya1!'
	}
});
