var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var flash = require('connect-flash');

var User = require('../models/user');

// Response globals defined
router.use(function(req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/login');
	}
}

router.get('/', function(req, res, next) {
	res.render('index');
});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
	res.render('profile');
});

router.post('/profile', ensureAuthenticated, function(req, res, next) {
	var email = req.body.newEmail;
	var password = req.body.newPassword;
	var password2 = req.body.newPassword2;

	console.log(email);

	req.checkBody('newEmail', 'Email is required.').notEmpty();
	req.checkBody('newEmail', 'Email is not valid.').isEmail();

	if(password != "") {
		req.checkBody('newPassword2', 'Passwords do not match.').equals(
			req.body.newPassword);
	}

	var errors = req.validationErrors();

	if(errors) {
		res.render('profile', {errors: errors});
		console.log(errors);
	} else {
		console.log("Trying to update info.");
		if(email != req.user.email) {
			User.changeEmail(req.user, email, function(err) {
				if(err) throw err;
			});
			console.log("Updated email.");
		}
		if(password != "") {
			User.changePassword(req.user, password, function(err) {
				if(err) throw err;
			});
			console.log("Updated password.");
		}
	
		req.flash('success_msg', 'You successfully updated your profile.');
		res.redirect('/profile');
	}
});

router.get('/users', ensureAuthenticated, function(req, res, next) {
	User.find({}, function(err, users) {
		users.sort(function(a, b) {
			if(a.username < b.username) return -1;
			if(a.username > b.username) return 1;
			return 0;
		});

		res.render('users', {users: users});
	});
});

router.post('/sendmessage', ensureAuthenticated, function(req, res, next) {
	var newMessage = {from: req.user.username, message: req.body.message};
	User.getUserByUsername(req.body.receiver, function(err, user) {
		if(err) throw err;
		user.messages.push(newMessage);
		user.save();
	});

	req.flash('success_msg', 'You successfully sent message.');
	res.redirect('/');
});

router.get('/messages', ensureAuthenticated, function(req, res, next) {
	User.getSentMessages(req.user, function(err, messages) {
		console.log(messages);

		var msglist = [];
		for(var i = 0; i < messages.length; i++) {
			for(var j = 0; j < messages[i].messages.length; j++) {
				console.log("From: " + messages[i].messages[j].from);
				if(messages[i].messages[j].from === req.user.username) {
					var msg = {to: messages[i].username, 
						msg: messages[i].messages[j].message};
					msglist.push(msg);
				}
			}
		}

		res.render('messages', {messages: msglist});
	});
});

router.post('/deletemessage', ensureAuthenticated, function(req, res, next) {
	var message = req.body.message;
	var from = "";
	var username = "";

	if(req.body.from != null && req.body.from != 'undefined') {
		from = req.body.from;
		username = req.user.username;
	} else {
		from = req.user.username;
		username = req.body.receiver;
	}

	User.getUserByUsername(username, function(err, user) {
		if(err) throw err;
		for(var i = user.messages.length-1; i >= 0; i--) {
			if(user.messages[i].message === message && 
				user.messages[i].from === from) {
				user.messages.splice(i, 1);
				user.save();
			}
		}
	});

	req.flash('success_msg', 'You successfully deleted a message.');
	res.redirect('/messages');
});

// Login user routes
router.get('/login', function(req, res, next) {
	res.render('login');
});

router.post('/login', passport.authenticate('local', 
	{ successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

// Register user routes
router.get('/register', function(req, res, next) {
	res.render('register');
});

router.post('/register', function(req, res, next) {
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	// Password validation
	req.checkBody('username', 'Usename is required.').notEmpty();
	req.checkBody('email', 'Email is required.').notEmpty();
	req.checkBody('email', 'Email is not valid.').isEmail();
	req.checkBody('password', 'Password is required.').notEmpty();
	req.checkBody('password2', 'Passwords do not match.').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors) {
		res.render('register', {errors: errors});
	} else {
		var newUser = new User({
			username: username,
			password: password,
			email: email
		});

		User.createUser(newUser, function(err, user) {
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You successfully registered and can now log in.');
		res.redirect('/login');
	}
});

// Logout user
router.get('/logout', ensureAuthenticated, function(req, res) {
	req.logout();
	req.flash('success_msg', 'You are logged out.');
	res.redirect('/login');
});


//Passport handling
passport.use(new LocalStrategy(function(username, password, done) {
	User.getUserByUsername(username, function(err, user) {
		if(err) throw err;
		if(!user) {
			return done(null, false, {message: 'Unknown user.'});
		}

		User.comparePassword(password, user.password, function(err, isMatch) {
			if(err) throw err;
			if(isMatch) {
				return done(null, user);
			} else {
				return done(null, false, {message: 'Invalid password.'});
			}
		})
	});
}));

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.getUserById(id, function(err, user) {
		done(err, user);
	});
});


module.exports = router;
