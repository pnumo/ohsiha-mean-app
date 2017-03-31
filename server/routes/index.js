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

router.post('/sendmessage', ensureAuthenticated, function(req, res, next) {
	var newMessage = {from: req.user.username, message: req.body.message};
	User.getUserByUsername(req.body.receiver, function(err, user) {
		if(err) throw err;
		user.messages.push(newMessage);
		user.save();
	});
	res.redirect('/');
});

router.get('/messages', ensureAuthenticated, function(req, res, next) {
	res.render('messages');
});

router.post('/deletemessage', ensureAuthenticated, function(req, res, next) {
	var from = req.body.from;
	var message = req.body.message;

	User.getUserByUsername(req.user.username, function(err, user) {
		if(err) throw err;
		for(var i = user.messages.length-1; i >= 0; i--) {
			if(user.messages[i].message === message && 
				user.messages[i].from === from) {
				user.messages.splice(i, 1);
				user.save();
			}
		}
	});

	res.redirect('/messages')
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
router.get('/logout', function(req, res) {
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
