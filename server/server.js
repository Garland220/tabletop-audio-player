'use strict';

// System
const _ = require('lodash'),

fs = require('fs'),
util = require('util'),
crypto = require('crypto'),
path = require('path'),

// HTTP
express = require('express'),
hbs = require('express-hbs'),

// Logging
Logger = require('./libs/logger.js'),
// MongoLogger = require('./server/libs/mongoLogger.js'),

// ORM
Waterline = require('waterline');

/**
 * Audio Server
 */
const server = {

  settings: null,

  log: null,

  app: null,
  http: null,
  io: null,

  sessions: {},

  activeMusicVolume: 0.5,
  activeMusic: null,

  activeSounds: {},

  clientCount: 0,

  users: {},
  sounds: {},
  channels: {},

  routes: function() {
    server.log.debug('Server.routes');

    server.app.get('/', function(req, res) {
      res.render('index');
    });

    server.app.get('/new', function(req, res) {
      server.models.channel.create({}, function(err, result) {
        if (err) {
          server.log.error(err);
         return res.sendStatus(500);
        }

        server.channels[result.id] = result;

        res.redirect('/channel' + result.id);
      });
    });

    server.app.get('/channel/:id', function(req, res) {
      let id = req.param('id');

      server.models.channel.findOne({id: id}, function(err, result) {
        if (err) {
          server.log.error(err);
          return res.status(500).render('500');
        }

        if (!result) {
          return res.status(404).render('500');
        }

        res.render('channel', {channel: result});
      });
    });

    server.app.get('/admin', function(req, res) {
      if (!server.settings.adminKey || req.query.key && req.query.key === server.settings.adminKey) {
        server.log.info('Admin Key Accepted');
        res.render('admin');
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
      server.io.sockets.emit('play', JSON.stringify({key: key}));
    });

    server.io.sockets.emit('users', JSON.stringify({users: server.clientCount}));
  },

  removeClient: function(socket) {
    server.log.debug('Server.removeClient');

    server.log.info('A user %s disconnected', socket.handshake.address);
    server.clientCount -= 1;

    server.io.sockets.emit('users', JSON.stringify({users: server.clientCount}));
  },

  loadClient: function(data) {
    server.log.debug('Server.loadClient');
    server.log.debug(data);

    // socket.emit('load');
  },

  joinChannel: function(data) {
    server.log.debug('Server.joinChannel');
    server.log.debug(data);
  },

  setVolume: function(data) {
    server.log.debug('Server.setVolume');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while adjusting sound volume.');
      return;
    }

    server.log.info('Adjusting Audio Volume of ' + data.key + ' to: ' + data.volume);

    server.io.sockets.emit('setVolume', JSON.stringify({key: data.key, volume: data.volume}));
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

    server.io.sockets.emit('setMusicVolume', JSON.stringify({volume: data.volume}));
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

    server.io.sockets.emit('play', JSON.stringify({key: data.key}));
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

    server.io.sockets.emit('stop', JSON.stringify({key: data.key}));
  },

  connection: function(socket) {
    server.log.debug('Server.connection');

    server.addClient(socket);

    socket.on('load', server.loadClient);

    socket.on('join', server.joinChannel);

    socket.on('setVolume', server.setVolume);

    socket.on('setMusicVolume', server.setMusicVolume);

    socket.on('play', server.play);

    socket.on('stop', server.stop);

    socket.on('disconnect', function() {
      server.removeClient(socket);
    });
  },

  randomHash: function() {
    server.log.debug('Server.randomHash');

    let current_date = (new Date()).valueOf().toString();
    let random = Math.random().toString();
    return crypto.createHash('sha1').update(current_date + random).digest('hex');
  },

  loadUsers: function() {
    server.models.user.find().exec(function(err, results) {
      if (err) {
        server.log.error(err);
        throw err;
      }

      if (results) {
        this.users = {};
        for (var i=0; i<results.length; i+=1) {
          var user = results[i];
          this.users[user.id] = user;
        }
      }

      server.UsersLoaded = true;
    });
  },

  loadSounds: function() {
    server.models.sound.find().exec(function(err, results) {
      if (err) {
        server.log.error(err);
        throw err;
      }

      if (results) {
        this.sounds = {};
        for (var i=0; i<results.length; i+=1) {
          var sound = results[i];
          this.sounds[sound.id] = sound;
        }
      }

      server.SoundsLoaded = true;
    });
  },

  loadChannels: function() {
    server.models.channel.find().exec(function(err, results) {
      if (err) {
        server.log.error(err);
        throw err;
      }

      if (results) {
        this.channels = {};
        for (var i=0; i<results.length; i+=1) {
          var channel = results[i];
          this.channels[channel.id] = channel;
        }
      }

      server.ChannelsLoaded = true;
    });
  },

  dataLoaded: function() {
    if (!server.UsersLoaded) {
      return false;
    }
    else if (!server.SoundsLoaded) {
      return false;
    }
    else if (!server.ChannelsLoaded) {
      return false;
    }

    return true;
  },

  /**
   * Waits until all models are loaded,
   *  then executes callback.
   */
  ready: function(callback) {
    server.log.debug('Server.ready');

    if (server.dataLoaded()) {
      server.log.info('Server data loaded');

      clearTimeout(server.readyTimer);
      callback();
    }
    else {
      server.readyTimer = setTimeout(function() {
        server.ready(callback);
      }, 100);
    }
  },

  setup: function(settings) {
    let views;

    server.settings = settings;

    server.orm = new Waterline();
    server.log = new Logger(settings).log;

    server.orm.loadCollection(Waterline.Collection.extend(_.merge(
      {connection: settings.waterline.defaults.connection},
      require('./models/User.js')
    )));
    server.orm.loadCollection(Waterline.Collection.extend(_.merge(
      {connection: settings.waterline.defaults.connection},
      require('./models/Sound.js')
    )));
    server.orm.loadCollection(Waterline.Collection.extend(_.merge(
      {connection: settings.waterline.defaults.connection},
      require('./models/Channel.js')
    )));

    server.app = express();
    server.http = require('http').Server(server.app);
    server.io = require('socket.io')(server.http);

    server.log.debug('Server.start');

    views = path.join(__dirname, '../', settings.view.location);

    server.app.set('views', views);
    server.app.set('view options', settings.view.options);
    server.app.set('view engine', settings.view.engine);

    server.app.engine('hbs', hbs.express4({
      defaultLayout: views + '/layouts/default.hbs',
      partialsDir: views + '/partials',
      layoutsDir: views + '/layouts'
    }));

    server.app.use(express.static(path.join(__dirname + '/../client')));

    server.routes();

    server.orm.initialize(settings.waterline, (function(err, models) {
      if (err) {
        throw err;
      }

      server.models = models.collections;
      server.connections = models.connections;

      server.loadUsers();
      server.loadSounds();
      server.loadChannels();

      server.ready(function() {
        server.start();
      });
    }));
  },

  start: function() {
    server.log.info('Starting websocket handler');
    server.io.on('connection', server.connection);

    server.log.info('Starting web server');
    server.http.listen(server.settings.port, function() {
      server.log.info('listening on *: ' + server.settings.port);
    });
  },

  quit: function() {
    server.log.debug('Server.quit');

    process.exit(0);
  }
};

module.exports = server;
