var bcrypt = require('bcryptjs');
var mongoose = require('mongoose');

// User schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true
	},
	password: { 
		type: String
	},
	email: {
		type: String
	},
	messages: {
		type: Array,
		message: [{from: String, message: String}]
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
	bcrypt.genSalt(10, function(err, salt) {
		bcrypt.hash(newUser.password, salt, function(err, hash) {
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}

module.exports.changePassword = function(user, newPassword, callback) {
	User.getUserByUsername(user.username, function(err, user) {
		bcrypt.genSalt(10, function(err, salt) {
			bcrypt.hash(newPassword, salt, function(err, hash) {
				user.password = hash;
				user.save(callback);
			});
		});
	});
}

module.exports.changeEmail = function(user, newEmail, callback) {
	User.getUserByUsername(user.username, function(err, user) {
		user.email = newEmail;
		user.save(callback);
	});
}

module.exports.getUserByUsername = function(username, callback) {
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback) {
	User.findById(id, callback);
}

module.exports.comparePassword = function(password, hash, callback) {
	bcrypt.compare(password, hash, function(err, isMatch) {
		if(err) throw err;
		callback(null, isMatch);
	});
}

module.exports.getSentMessages = function(user, callback) {
	User.find({'messages.from': user.username}).select(
		'username messages.from messages.message').exec(callback);
}
