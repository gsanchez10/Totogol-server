const User = require('../models/user');
const Fecha = require('../models/fecha');
const _ = require('lodash');

exports.changePlayerGoals = function(req, res, next) {
  const { fechas, username } = req.body;

  /*Fecha.find({}, function(err, systemFechas) {
    User.findOne({'username': username}, function(err, user) {
      const changedFecha = Object.assign({}, 
        user.fechas.find(userFecha => userFecha.number === fecha.fechaNumber) ||
        systemFechas.find(systemFecha => systemFecha.number === fecha.fechaNumber)
      );

      changedFecha.games = changedFecha.games.map(changedFechaGame => {
        if(changedFechaGame.number === params.juegoNumber) {
          const changedGame = Object.assign({}, changedFechaGame);
          changedGame.goalsHome = params.goalsHome;
          changedGame.goalsAway = params.goalsAway;

          return changedGame;
        }

          return changedFechaGame;      
      });
    });
  });*/

  Fecha.find({}, function(err, systemFechas) {
    User.findOne({'username': username}, function(err, user) {
      const userFechas = _.cloneDeep(user.fechas);
      
      fechas.forEach(paramsFecha => {
        const systemFecha = systemFechas.find(systemFecha => systemFecha.number === paramsFecha.number);

        //console.log('system fecha', systemFecha);
        const fechaToUpdate = userFechas.find(userFecha => paramsFecha.number === userFecha.number);
        console.log('fecha del usuario que vamos a modificar', fechaToUpdate);
        const now = new Date();
        const closingDate = new Date(systemFecha.closingDate);

        if(!fechaToUpdate) {
          userFechas.push(paramsFecha);
        }else
        if(now < closingDate) {
          //console.log('paramsFecha.games', paramsFecha.games);
          fechaToUpdate.games = paramsFecha.games;
          fechaToUpdate.games = fechaToUpdate.games.filter(gameToUpdate =>
            systemFecha.games.find(systemGame =>
              systemGame.number === gameToUpdate.number &&
              systemGame.homeTeam === gameToUpdate.homeTeam &&
              systemGame.awayTeam === gameToUpdate.awayTeam
            )
          );
        }
      });

      User.findOneAndUpdate({'username': username},
        {$set: {'fechas': userFechas}},
        {new: true},
        function(err, updatedRows) {
          if(err) { return next(err); }
          console.log('updated rows', updatedRows.fechas[0]);
          res.json({ result: true, user: updatedRows });
        }
      );
    });
  });

  /* User.update({'username': username},
    {$set: {"fechas": fechas}},
    function(err, updatedRows) {
      if(err) { return next(err); }

      res.json({ result: true, updatedRows });
    }
  ); */
  /* User.update({'username': username},
    {$set: {"fechas.$[i].games.$[j].goalsHome": 55}}, {arrayFilters: [{"i.number": 2}, {"j.number": 2}]},
    function(err) {
    if(err) { return next(err); }

    res.json({ result: true });
  }); */
  /* User.update(
    {'fechas.number': fecha.number, 'fechas.games.number': fecha.games[0].number},
    {
      '$set': {
        'fechas.0.games.$.goalsHome': 99,
        //'fechas.0.games.$.goalsAway': fecha.games[0].goalsAway
      }
    },
    function(err, updatedRows) {
      if(err) { return next(err); }

      res.json({ result: true, updatedRows });
    }
  ); */

  /* User.findOne({'username': username}, function(err, user) {
    if(err) { return next(err); }

    if(user) {
      const userFecha = user.fechas.find(currentFecha => currentFecha.number === fecha.number);
      if(userFecha) {
        const userJuego = userFecha.games.find(currentJuego => currentJuego.number === fecha.games[0].number);
        if(userJuego) {
          User.update(
            {'username': username, 'fechas.number': fecha.number, 'fechas.games.number': 2},
            {
              '$set': {
                'fechas.0.games.$.goalsHome': 99,
                //'fechas.0.games.$.goalsAway': fecha.games[0].goalsAway
              }
            },
            function(err, updatedRows) {
              if(err) { return next(err); }

              res.json({ result: true, updatedRows });
            }
          );
        }else {
          User.update(
            {'username': username, 'fechas.number': fecha.number},
            {
              '$push': {'fechas.0.games': fecha.games[0] }
            },
            function(err, updatedRows) {
              if(err) { return next(err); }

              res.json({ result: true, updatedRows });
            }
          );
        }
      }else {
        User.update(
          {'username': username, 'fechas.number': fecha.number},
          {
            '$push': {'fechas': fecha }
          },
          { upsert: true },
          function(err, updatedRows) {
            if(err) { return next(err); }

            res.json({ result: true, updatedRows });
          }
        );
      }
    }
  }); */
};

exports.getPlayersFechas = function(req, res, next) {
  const { username } = req.query;

  User.findOne({'username': username}, function(err, user) {    
    if(err) { return next(err); }

    res.json({ result: true, fechas: user.fechas });
  });
};

exports.getPlayers = function(req, res, next) {
  User.find({}, function(err, users) {

    res.send(users);
  });
};