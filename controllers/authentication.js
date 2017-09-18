const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config');

function tokenForUser(user) {
	const timestamp = new Date().getTime();
	return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signin = function(req, res, next) {
	// User has already had their email and password auth'd
	// we just need to give them a token
	console.log('singin');
	res.send({ token: tokenForUser(req.user), user: req.user });
};

exports.getUser = function(req, res, next) {
	res.send({ user: req.user });
};

exports.signup = function(req, res, next) {
	const { email, username, password } = req.body;
			console.log('email', email);
			console.log('username', username);

	if(!email || !password || !username) {
		return res.status(422).send({ error: 'Debe indicar un usuario, un correo y una contraseña.'});
	}

	// See if a user with a given email exists
	User.findOne({ email: email }, function(err, existingEmail) {
		// If a user with email does exist, return an error
		if(existingEmail) {
			return res.status(422).send({ error: 'Ya hay alguien registrado con ese correo.' });
		}
		User.findOne({ username: username }, function(err, existingUser) {
			if(err) { return next(err); }

			// If a user with email does exist, return an error
			if(existingUser) {
				return res.status(422).send({ error: 'Ya hay alguien registrado con ese nombre de usuario.' });
			}

			// If a user with email does NOT exist, create and save user record
			const user = new User({
				email: email,
				password: password,
				username: username
			});

			user.save(function(err) {
				if(err) { return next(err); }

				// Respond to request indicating the user was created
				res.json({ token: tokenForUser(user) });
			});
		});
	});
}

exports.changePassword = function(req, res, next) {
	const { username, password } = req.body;

	if(!password) {
		return res.status(422).send({ error: 'Ingrese una contraseña.'});
	}

	// See if a user with a given email exists
	User.findOne({ username }, function(err, user) {
		if(err) { return next(err); }
		user.password = password;

		user.save(function(err) {
			if(err) { return next(err); }

			// Respond to request indicating the user was created
			res.json({ token: tokenForUser(user), result: true });
		});
	});
}