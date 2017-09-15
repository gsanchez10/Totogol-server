const Fecha = require('../models/fecha');
const User = require('../models/user');
const config = require('../config');

exports.getFechas = function(req, res, next) {
	Fecha.find({}, function(err, fechas) {

		res.send(fechas);
	});
};

exports.addFecha = function(req, res, next) {
	const { number, closingDate, games } = req.body;

	if(!number) {
		return res.status(422).send({ error: 'Debe proveer un numero de fecha.'});
	}
	if(!req.user.canAdmin) {
		return res.status(422).send({ error: 'Debe ser un administrador para modificar este valor.'});	
	}

	Fecha.findOne({ number }, function(err, existingFecha) {
		if(err) { return next(err); }

		// If a user with email does exist, return an error
		if(existingFecha) {
			return res.status(422).send({ error: 'Número de fecha ya existe.' });
		}

		const fecha = new Fecha({
			number,
			games,
			closingDate
		});

		fecha.save(function(err) {
			if(err) { return next(err); }

			// Respond to request indicating the game was created
			res.json({ result: true });
		});
	});
};

exports.addGame = function(req, res, next) {
	if(!req.user.canAdmin) {
		return res.status(422).send({ error: 'Debe ser un administrador para modificar este valor.'});	
	}
	const fechaNumber = req.body.fechaNumber;
	const game = req.body.game;

	Fecha.findOne({ number: fechaNumber }, function(err, fecha) {
		fecha.games.push(game);

		fecha.save(function(err) {
			if(err) { return next(err); }

		  res.json({ result: true });
		});
	});
};

exports.changeGoals = function(req, res, next) {
	if(!req.user.canAdmin) {
		return res.status(422).send({ error: 'Debe ser un administrador para modificar este valor.'});	
	}
	const { fechaNumber, juegoNumber, goalsHome, goalsAway } = req.body;

	/* Fecha.findOne({'number': fechaNumber}, function(err, fecha) {
		const current = new Date();

		if(current > fecha.closingDate) {
			res.status(422).send({ error: 'Fecha ya esta cerrada.'});
		}else { */
			Fecha.update({'number': fechaNumber, 'games.number': juegoNumber},
				{'$set': {'games.$.goalsHome': goalsHome, 'games.$.goalsAway': goalsAway }}, function(err) {
				if(err) { return next(err); }

				res.json({ result: true });
			});
		/* }
	}); */
};

exports.deleteFecha = function(req, res, next) {
	if(!req.user.canAdmin) {
		return res.status(422).send({ error: 'Debe ser un administrador para modificar este valor.'});	
	}
	const { fechaNumber } = req.body;

	Fecha.find({'number': fechaNumber}).remove(function(err) {
		if(err) { return next(err); }

		User.update(
			{},
			{ $pull: { fechas: { number: fechaNumber } }},
			function(err) {
				if(err) { return next(err); }
			}
		);

		res.json({ result: true });
	});
};

exports.deleteGame = function(req, res, next) {
	if(!req.user.canAdmin) {
		return res.status(422).send({ error: 'Debe ser un administrador para modificar este valor.'});	
	}
	const { fechaNumber, juegoNumber } = req.body;

	Fecha.update({ number: fechaNumber }, { $pull: { games: { number: juegoNumber } }}, function(err) {
		if(err) { return next(err); }

		/*User.update(
			{},
			{ $pull: { fechas.games.number: { number: fechaNumber, games.$.number: juegoNumber } }},
			function(err) {
				if(err) { return next(err); }
			}
		);*/

		res.json({ result: true });
	});
};
