const Authentication = require('./controllers/authentication');
const Games = require('./controllers/games');
const Play = require('./controllers/play');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
	/* app.get('/', function(req, res, next) {
		res.send(['waterbottle', 'phone', 'paper']);
	}); */
	app.get('/', requireAuth, function(req, res) {
		res.send({ hi: 'there' });
	});
	app.get('/fechas', requireAuth, Games.getFechas);
	app.post('/addFecha', requireAuth, Games.addFecha);
	app.post('/addGame', requireAuth, Games.addGame);
	app.put('/changeGoals', requireAuth, Games.changeGoals);
	app.post('/deleteFecha', requireAuth, Games.deleteFecha);
	app.post('/deleteGame', requireAuth, Games.deleteGame);
	app.post('/signin', requireSignin, Authentication.signin);
	app.post('/signup', Authentication.signup);
	app.post('/changePassword', requireAuth, Authentication.changePassword);
	/*
	TODO: crear un middleware que verifique si el usuario es administrador para que permita hacer llamar los servicios de
	administrador solo a los administradores
	*/
	app.get('/playerFechas', requireAuth, Play.getPlayersFechas);
	app.post('/changePlayerGoals', requireAuth, Play.changePlayerGoals);
	app.get('/userInfo', requireAuth, Authentication.getUser);
	app.get('/getPlayers', requireAuth, Play.getPlayers);
}