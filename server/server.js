'use strict';

// System
const _ = require('lodash'),

fs = require('fs'),
util = require('util'),
crypto = require('crypto'),
path = require('path'),

format = require('string-format'),

// HTTP
express = require('express'),
hbs = require('express-hbs'),
bodyParser = require("body-parser"),

// Logging
Logger = require('./libs/logger.js'),
// MongoLogger = require('./server/libs/mongoLogger.js'),

// ORM
Waterline = require('waterline');

format.extend(String.prototype);

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
          return res.status(500).render('500');
        }

        server.channels[result.id] = result;

        res.redirect('/channel' + result.id);
      });
    });

    server.app.get('/channel/:id/admin', function(req, res) {
      let id = req.params.id;

      if (!id) {
        server.log.error('Requested page without ID');
        return res.status(500).render('500');
      }

      server.models.channel.findOne({id: id}, function(err, result) {
        if (err) {
          server.log.error(err);
          return res.status(500).render('500');
        }

        if (!result) {
          return res.status(404).render('404');
        }

        if (req.query.key && req.query.key == result.adminKey) {
          server.log.info('Admin Key Accepted for channel {0}'.format(id));
          res.render('admin', {channel: result, sounds: result.audioLibrary});
        }
        else {
          server.log.error('Wrong admin key {0} tried for channel {1}.'.format(req.query.key, id));
          return res.status(403).render('403');
        }
      });
    });

    server.app.get('/channel/:id/edit', function(req, res) {
      let id = req.params.id,
        audioLibrary = req.params.audioLibrary;

      if (!id) {
        server.log.error('Requested page without ID');
        return res.status(500).render('500');
      }

      server.models.channel.findOne({id: id}, function(err, result) {
        if (err) {
          server.log.error(err);
          return res.status(500).render('500');
        }

        if (!result) {
          return res.status(404).render('404');
        }

        result.audioLibrary = JSON.stringify(result.audioLibrary);

        res.render('edit', {channel: result});
      });
    });

    server.app.post('/channel/:id/edit', function(req, res) {
      let id = req.params.id,
        audioLibrary = req.body.audioLibrary;

      console.log(id, audioLibrary.length);

      // audioLibrary = JSON.parse(req.params.audioLibrary);

      if (!id) {
        server.log.error('Requested page without ID');
        return res.status(500).render('500');
      }

      server.models.channel.update({id: id},{audioLibrary: audioLibrary}).exec(function(err, result) {
        if (err) {
          server.log.error(err);
          return res.status(500).render('500');
        }

        if (!result) {
          return res.status(404).render('404');
        }

        res.redirect('/channel/'+id);
      });
    });

    server.app.get('/channel/:id', function(req, res) {
      let id = req.params.id;

      if (!id) {
        server.log.error('Requested page without ID');
        return res.status(500).render('500');
      }

      server.models.channel.findOne({id: id}, function(err, result) {
        if (err) {
          server.log.error(err);
          return res.status(500).render('500');
        }

        if (!result) {
          return res.status(404).render('404');
        }

        // result.picture = '/images/ravenloft_crest.png';
        // result.name = 'The Curse of Strahd';
        // result.description = 'Under raging storm clouds, a lone figure stands silhouetted against the ancient walls of Castle Ravenloft. The vampire Count Strahd von Zarovich stares down a sheer cliff at the village below. A cold, bitter wind spins dead leaves about him, billowing his cape in the darkness.';
        // result.adminKey = '1';
        // result.save();

        res.render('channel', {channel: result});
      });
    });
  },


  addClient: function(socket) {
    server.log.debug('Server.addClient');

    let channel = server.channels[socket.request._query.channel];

    socket.channel = channel.id;
    channel.clientCount += 1;

    server.log.info('A user({0}) connected to channel {1}'.format(socket.handshake.address, channel.id));

    socket.join(channel.token);

    socket.emit('active', JSON.stringify({active: channel.activeAudio}));
    socket.emit('setMusicVolume', JSON.stringify({volume: server.activeMusicVolume}));

    socket.emit('load', JSON.stringify(channel.audioLibrary));

    server.io.sockets.to(channel.token).emit('users', JSON.stringify({users: channel.clientCount}));
  },

  removeClient: function(socket) {
    server.log.debug('Server.removeClient');

    let channel = server.channels[socket.channel];

    socket.leave(channel.token);

    server.log.info('A user({0}) disconnected from channel {1}'.format(socket.handshake.address, channel.id));

    channel.clientCount -= 1;

    server.io.sockets.to(channel.token).emit('users', JSON.stringify({users: channel.clientCount}));
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

    let channel = server.channels[data.channel];

    server.log.info('Adjusting Audio Volume in channel {0} of {1} to: {2}.'.format(channel.id, data.key, data.volume));

    server.io.sockets.to(channel.token).emit('setVolume', JSON.stringify({key: data.key, volume: data.volume}));
  },

  setMusicVolume: function(data) {
    server.log.debug('Server.setMusicVolume');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while adjusting music volume.');
      return;
    }

    let channel = server.channels[data.channel];

    server.log.info('Adjusting Music Volume in channel {0} to: {1}'.format(channel.id, data.volume));

    channel.activeMusicVolume = data.volume;

    server.io.sockets.to(channel.token).emit('setMusicVolume', JSON.stringify({volume: data.volume}));
  },

  play: function(data) {
    server.log.debug('Server.play');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while playing audio.');
      return;
    }

    let channel = server.channels[data.channel];

    server.log.info('Playing Audio: {0} in channel {1}.'.format(data.key, channel.id));

    if (data.type == 'music') {
      channel.activeMusic = data.key;
      channel.save();
    }
    else if (data.loop === true) {
      channel.activeAudio[data.key] = data;
      channel.save();
    }

    server.io.sockets.to(channel.token).emit('play', JSON.stringify({key: data.key}));
  },

  stop: function(data) {
    server.log.debug('Server.stop');
    server.log.debug(data);

    if (!data) {
      server.log.error('Empty data while stopping audio.');
      return;
    }

    let channel = server.channels[data.channel];

    server.log.info('Stopping Audio: {0} in channel {1}.'.format(data.key, channel.id));

    if (data.type == 'music' && data.key == channel.activeMusic) {
      channel.activeMusic = null;
      channel.save();
    }
    else if (channel.activeAudio && channel.activeAudio[data.key]) {
      delete channel.activeAudio[data.key];
      channel.save();
    }

    server.io.sockets.to(channel.token).emit('stop', JSON.stringify({key: data.key}));
  },

  connection: function(socket) {
    server.log.debug('Server.connection');

    server.addClient(socket);

    socket.on('load', function() {
      let channel = server.channels[socket.channel];

      if (server.activeMusic !== null) {
        socket.emit('play', JSON.stringify({key: server.activeMusic}));
      }
      Object.keys(channel.activeAudio).forEach(function(key) {
        socket.emit('play', JSON.stringify({key: key}));
      });
    });

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
        server.users = {};
        for (var i=0; i<results.length; i+=1) {
          var user = results[i];
          server.users[user.id] = user;
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
        server.sounds = {};
        for (var i=0; i<results.length; i+=1) {
          var sound = results[i];
          server.sounds[sound.id] = sound;
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
        server.channels = {};
        for (var i=0; i<results.length; i+=1) {
          var channel = results[i];
          channel.clientCount = 0;
          channel.token = 'channel' + channel.id;
          if (!channel.activeAudio) {
            channel.activeAudio = {};
          }
          server.channels[channel.id] = channel;
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

    server.app.use(bodyParser.urlencoded({extended: false}));
    server.app.use(bodyParser.json());

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
    server.log.info('Starting websocket handler.');
    server.io.on('connection', server.connection);

    server.log.info('Starting web server.');
    server.http.listen(server.settings.port, function() {
      server.log.info('listening on *:{0}'.format(server.settings.port));
    });
  },

  quit: function() {
    server.log.debug('Server.quit');

    process.exit(0);
  }
};

module.exports = server;
