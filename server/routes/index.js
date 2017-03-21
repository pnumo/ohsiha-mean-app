var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

function ensureAuthenticated(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		return res.redirect('/login');
	}
}


router.get('/', function(req, res, next) {
	res.render('index', {name: "Index"});
});

router.get('/login', function(req, res, next) {
	res.render('login', {name: "Login"});
});

router.get('/register', function(req, res, next) {
	res.render('register', {name: "Register"});
});


router.post('/login', passport.authenticate('local', { successRedirect: '/', 
	failureRedirect: '/login' }));

router.post('/register', function(req, res, next) {
	var username = req.body.username;
  	var password = req.body.password;
  	var firstname = req.body.firstname;
  	var lastname = req.body.lastname;
  	var email = req.body.email;
  	var phonenumber = req.body.phonenumber;
  	var organizer = req.body.organizer;

  	req.checkBody('username', 'Username is required').notEmpty();
  	req.checkBody('password', 'Password is required').notEmpty();
  	req.checkBody('firstname', 'First name is required').notEmpty();
  	req.checkBody('lastname', 'Last name is required').notEmpty();
  	req.checkBody('email', 'Email is required').notEmpty();
  	req.checkBody('email', 'Email is not valid').isEmail();
  	req.checkBody('phonenumber', 'Phone number is required').notEmpty();
  	req.checkBody('organizer', 'League organizer is required').notEmpty();

  	var errors = req.validationErrors();

  	if(errors) {
  		res.render('register', { errors: errors });
  	} else {
  		//add new user
  		res.redirect('/');
  	}
});

router.all('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/', { message: 'User has logged out.' });
});

passport.use('local-signup', new LocalStrategy(
	{
		usernameField: 'username',
		passwordField: 'password'
	},
	function(username, password, done) {
	}
));

passport.serializeUser(function(user, done) {
	done(null, user['username']);
});

passport.deserializeUser(function(username, done) {
});

module.exports = router;
