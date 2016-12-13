'use strict';

const SETTINGS = require('./settings.json'),

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

sqlite3 = require('sqlite3').verbose();


/**
 * Audio Server
 */
const server = {

  db: new sqlite3.Database(SETTINGS.db.name),
  log: new Logger(SETTINGS).log,

  sessions: {},

  activeMusicVolume: 0.5,
  activeMusic: null,
  activeSounds: {},

  clientCount: 0,
  users: [],

  randomHash: function() {
    server.log.debug('Server.randomHash');

    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
  },

  routes: function() {
    server.log.debug('Server.routes');

    app.set('views', __dirname + '/client/views');
    app.set('view engine', 'jade');
    app.set('view options', { layout: true });
    app.use(express.static('client'));

    app.get('/', function(req, res) {
      res.render('index', {});
    });

    app.get('/admin', function(req, res) {
      if (!SETTINGS.adminKey || req.query.key && req.query.key === SETTINGS.adminKey) {
        server.log.info('Admin Key Accepted');
        res.render('admin', {});
      }
      else {
        server.log.error('admin key tried: ' + req.query.key);
        res.sendStatus(403);
      }
    });
  },

  addClient: function(socket) {
    server.log.debug('Server.addClient');

    server.log.info('A user connected from %s', socket.handshake.address);
    server.clientCount += 1;

    socket.emit('active', JSON.stringify({active: server.activeSounds}));
    socket.emit('setMusicVolume', JSON.stringify({volume: server.activeMusicVolume}));

    if (server.activeMusic !== null) {
      socket.emit('play', JSON.stringify({key: server.activeMusic}));
    }
    Object.keys(server.activeSounds).forEach(function(key) {
      io.sockets.emit('play', JSON.stringify({key: key}));
    });

    io.sockets.emit('users', JSON.stringify({users: server.clientCount}));
  },

  removeClient: function(socket) {
    server.log.debug('Server.removeClient');

    server.log.info('A user %s disconnected', socket.handshake.address);
    server.clientCount -= 1;

    io.sockets.emit('users', JSON.stringify({users: server.clientCount}));
  },

  loadClient: function(data) {
    server.log.debug('Server.loadClient');
    server.log.debug(data);

    // socket.emit('load');
  },

  setVolume: function(data) {
    server.log.debug('Server.setVolume');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while adjusting sound volume.');
      return;
    }

    server.log.info('Adjusting Audio Volume of ' + data.key + ' to: ' + data.volume);

    io.sockets.emit('setVolume', JSON.stringify({key: data.key, volume: data.volume}));
  },

  setMusicVolume: function(data) {
    server.log.debug('Server.setMusicVolume');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while adjusting music volume.');
      return;
    }

    server.log.info('Adjusting Music Volume to: ' + data.volume);

    server.activeMusicVolume = data.volume;

    io.sockets.emit('setMusicVolume', JSON.stringify({volume: data.volume}));
  },

  play: function(data) {
    server.log.debug('Server.play');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while playing audio.');
      return;
    }

    server.log.info('Playing Audio: ' + data.key);

    if (data.type == 'music') {
      server.activeMusic = data.key;
    }
    else if (data.loop === true) {
      server.activeSounds[data.key] = data;
    }

    io.sockets.emit('play', JSON.stringify({key: data.key}));
  },

  stop: function(data) {
    server.log.debug('Server.stop');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while stopping audio.');
      return;
    }

    server.log.info('Stopping Audio: ' + data.key);

    if (data.type == 'music' && data.key == server.activeMusic) {
      server.activeMusic = null;
    }
    else {
      delete server.activeSounds[data.key];
    }

    io.sockets.emit('stop', JSON.stringify({key: data.key}));
  },

  connection: function(socket) {
    server.log.debug('Server.connection');

    server.addClient(socket);

    socket.on('load', server.loadClient);

    socket.on('setVolume', server.setVolume);

    socket.on('setMusicVolume', server.setMusicVolume);

    socket.on('play', server.play);

    socket.on('stop', server.stop);

    socket.on('disconnect', server.removeClient);
  },

  start: function() {
    server.log.debug('Server.start');

    server.routes();

    io.on('connection', server.connection);

    http.listen(SETTINGS.port, function() {
      server.log.info('listening on *:'+SETTINGS.port);
    });
  },

  quit: function() {
    server.log.debug('Server.quit');

    server.db.close();

    process.exit(0);
  }
};

server.start();