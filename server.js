/*global require, module, __dirname */
/*jslint node: true */
'use strict';

var version = '0.0.4',
  util = require('util'),
  fs = require('fs'),
  express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http),
  // pg = require('pg'),
  // SETTINGS = {port: 8080},
  SETTINGS = require('./settings.json'),
  users,
  active = {},
  activeMusic = null,
  activeMusicVolume = 0.5;

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.use(express.static('client'));

app.get('/', function(req, res) {
  res.render('index', {});
});

app.get('/admin', function(req, res) {
  if (req.query.key && req.query.key === SETTINGS.adminKey) {
    console.log('Admin Key Accepted');
    res.render('admin', {});
  }
  else {
    console.log('admin key tried: ' + req.query.key);
    res.sendStatus(403);
  }
});


var clientCount = 0;
io.on('connection', function(socket) {
  console.log('A user connected from %s', socket.handshake.address);
  clientCount += 1;

  socket.emit('active', JSON.stringify({active: active}));
  if (activeMusic !== null) {
    socket.emit('play', JSON.stringify({key: activeMusic}));
  }
  socket.emit('setMusicVolume', JSON.stringify({volume: activeMusicVolume}));
  io.sockets.emit('users', JSON.stringify({users: clientCount}));

  socket.on('load', function(data) {
    // socket.emit('load');
  });

  socket.on('setVolume', function(data) {
    console.log('Adjusting Audio Volume');

    if (!data) {
      console.error('empty data');
      return;
    }

    io.sockets.emit('setVolume', JSON.stringify({key: data.key, volume: data.volume}));
  });

  socket.on('setMusicVolume', function(data) {
    console.log('Adjusting Music Volume');

    if (!data) {
      console.error('empty data');
      return;
    }

    activeMusicVolume = data.volume;

    io.sockets.emit('setMusicVolume', JSON.stringify({volume: data.volume}));
  });

  socket.on('play', function(data) {
    console.log('Playing Audio');
    console.log(data);

    if (!data) {
      console.error('empty data');
      return;
    }

    if (data.type == 'music') {
      activeMusic = data.key;
    }
    else {
      active[data.key] = data;
    }

    io.sockets.emit('play', JSON.stringify({key: data.key}));
  });

  socket.on('stop', function(data) {
    console.log('Stopping Audio');

    if (!data) {
      console.error('empty data');
      return;
    }
    if (data.type == 'music') {
      activeMusic = null;
    }
    else {
      delete active[data.key];
    }

    io.sockets.emit('stop', JSON.stringify({key: data.key}));
  });

  socket.on('disconnect', function(){
    console.log('User disconnected');

    clientCount -= 1;
    io.sockets.emit('users', JSON.stringify({users: clientCount}));
  });

});


http.listen(SETTINGS.port, function(){
  console.log('listening on *:'+SETTINGS.port);
});
