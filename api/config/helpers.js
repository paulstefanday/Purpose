var M = require(__base+'/models'),
	config = require(__base+'/config/config'),
	bcrypt = require('co-bcryptjs'),
	randomstring = require('randomstring'),
	thinky = require(__base+'/config/thinky.js'),
	r = thinky.r;

module.exports = {

	userExists: function* (email) { // Check if user exists

		var existingUser = yield M.User.filter({email: email }).run();

		// Check if response is an empty array and return id or false
		if(existingUser.length > 0) return existingUser[0];
		else return false;
	},

	userCreate: function* (data, provider) { // Create new user

		var user, result, rawPassword, password;

		if(provider) {

			user = new M.User({email: data.email, name: data.name, provider_id: data.id, provider: provider });
			result = yield user.save();

		} else {

			// Set password if it's not set already
			rawPassword = this.generatePassword(data);
			password = yield this.hashPassword(rawPassword);

			// Update record
			user = new M.User({email: data.email, password: password });
			result = yield user.save();

			// Send an email to user with their password

		}

		return result;

	},

	hashPassword: function* (password) {

		// encrypt pass - concider putting in model pre function
		var salt = yield bcrypt.genSalt(10);
		var hash = yield bcrypt.hash(password, salt);

		return hash;
	},

	generatePassword: function(record) {
		if(record.password) return record.password;
		else return randomstring.generate(7);
	}

}

