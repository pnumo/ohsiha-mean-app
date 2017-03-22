var express = require('express');
var router = express.Router();
var passport = require('passport');

var mongojs = require('mongojs');
var db = mongojs('mongodb://pnumo:pnumo@ds143777.mlab.com:43777/ohsiha-mean-app', ['Users']);


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

router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/register', function(req, res, next) {
	res.render('register');
});

router.get('/users', function(req, res, next) {
	db.Users.find(function(err, users) {
		if(err) {
			res.send(err);
		} else {
			res.json(users);
		}
	})
});

router.get('/user/:id', function(req, res, next) {
	db.Users.findOne({_id: mongojs.ObjectId(req.params.id)}, function(err, users) {
		if(err) {
			res.send(err);
		} else {
			res.json(user);
		}
	})
});

router.get('/profile', function(req, res, next) {
	res.render('/profile');
});

router.all('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/', { message: 'User has logged out.' });
});

router.post('/login', passport.authenticate('local', { successRedirect: '/', 
	failureRedirect: '/login' }));

router.post('/register', function(req, res, next) {
});

passport.serializeUser(function(user, done) {
	done(null, user['username']);
});

passport.deserializeUser(function(username, done) {
});

module.exports = router;
