'use strict';

var SETTINGS = require('./settings.json'),

  // System
  fs = require('fs'),
  util = require('util'),
  crypto = require('crypto'),

  // HTTP
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),

  // Logging
  Logger = require('./server/logger.js'),
  log = new Logger(SETTINGS).log,

  sessions = {},

  activeMusicVolume = 0.5,
  activeMusic = null,
  activeSounds = {},

  clientCount = 0,
  users = [];

function randomHash() {
  var current_date = (new Date()).valueOf().toString();
  var random = Math.random().toString();
  return crypto.createHash('sha1').update(current_date + random).digest('hex');
}

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.use(express.static('client'));

app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/admin', function(req, res) {
  if (!SETTINGS.adminKey || req.query.key && req.query.key === SETTINGS.adminKey) {
    log.info('Admin Key Accepted');
    res.render('admin', {});
  }
  else {
    log.error('admin key tried: ' + req.query.key);
    res.sendStatus(403);
  }
});


io.on('connection', function(socket) {
  log.info('A user connected from %s', socket.handshake.address);
  clientCount += 1;

  socket.emit('active', JSON.stringify({active: activeSounds}));
  socket.emit('setMusicVolume', JSON.stringify({volume: activeMusicVolume}));
  if (activeMusic !== null) {
    socket.emit('play', JSON.stringify({key: activeMusic}));
  }
  Object.keys(activeSounds).forEach(function(key) {
    io.sockets.emit('play', JSON.stringify({key: key}));
  });

  io.sockets.emit('users', JSON.stringify({users: clientCount}));

  socket.on('load', function(data) {
    // socket.emit('load');
  });

  socket.on('setVolume', function(data) {
    log.info('Adjusting Audio Volume');

    if (!data) {
      console.error('empty data');
      return;
    }

    io.sockets.emit('setVolume', JSON.stringify({key: data.key, volume: data.volume}));
  });

  socket.on('setMusicVolume', function(data) {
    log.info('Adjusting Music Volume');

    if (!data) {
      log.error('empty data');
      return;
    }

    activeMusicVolume = data.volume;

    io.sockets.emit('setMusicVolume', JSON.stringify({volume: data.volume}));
  });

  socket.on('play', function(data) {
    log.info('Playing Audio');
    log.debug(data);

    if (!data) {
      log.error('empty data');
      return;
    }

    console.log(data.loop);

    if (data.type == 'music') {
      activeMusic = data.key;
    }
    else if (data.loop === true) {
      activeSounds[data.key] = data;
    }

    io.sockets.emit('play', JSON.stringify({key: data.key}));
  });

  socket.on('stop', function(data) {
    log.info('Stopping Audio');

    if (!data) {
      log.error('empty data');
      return;
    }
    if (data.type == 'music' && data.key == activeMusic) {
      activeMusic = null;
    }
    else {
      delete activeSounds[data.key];
    }

    io.sockets.emit('stop', JSON.stringify({key: data.key}));
  });

  socket.on('disconnect', function(){
    log.info('A user %s disconnected', socket.handshake.address);

    clientCount -= 1;
    io.sockets.emit('users', JSON.stringify({users: clientCount}));
  });

});


http.listen(SETTINGS.port, function() {
  log.info('listening on *:'+SETTINGS.port);
});
