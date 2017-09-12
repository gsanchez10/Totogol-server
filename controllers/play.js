const User = require('../models/user');
const Fecha = require('../models/fecha');
const _ = require('lodash');

exports.changePlayerGoals = function(req, res, next) {
  const { fechas, username } = req.body;

  Fecha.find({}, function(err, systemFechas) {
    User.findOne({'username': username}, function(err, user) {
      const userFechas = _.cloneDeep(user.fechas);
      
      fechas.forEach(currentFecha => {
        const systemFecha = systemFechas.find(systemFecha => systemFecha.number === currentFecha.number);
        const fechaToUpdate = userFechas.find(userFecha => currentFecha.number === userFecha.number);
        const now = new Date();
        const closingDate = new Date(systemFecha.closingDate);

        if(!fechaToUpdate) {
          userFechas.push(currentFecha);
        }else
        if(now < closingDate) {
          fechaToUpdate.games = currentFecha.games;
        }
      });

      User.findOneAndUpdate({'username': username},
        {$set: {'fechas': userFechas}},
        {new: true},
        function(err, updatedRows) {
          if(err) { return next(err); }
          console.log('updated rows', updatedRows.fechas[3]);
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
        console.log('userFecha.games', userFecha.games);
        const userJuego = userFecha.games.find(currentJuego => currentJuego.number === fecha.games[0].number);
        if(userJuego) {
          console.log('juego existeeeeeeeeeeeee', fecha.games[0].goalsHome);
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
          console.log('juego noooooooooooo existeeeeeeeeeeeee');
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
        console.log('fecha no existe');
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

  console.log('username', username);

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