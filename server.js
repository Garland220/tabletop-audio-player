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
  SETTINGS = {port: 8080},
  // SETTINGS = require('./settings.json'),
  users,
  active = [];

app.set('views', __dirname + '/client/views');
app.set('view engine', 'jade');
app.set('view options', { layout: true });
app.use(express.static('client'));

app.get('/', function(req, res){
  res.render('index', {});
});

app.get('/admin', function(req, res){
  res.render('admin', {});
});


var clientCount = 0;
io.on('connection', function(socket) {
  console.log('A user connected from %s', socket.handshake.address);
  clientCount += 1;

  io.sockets.emit('active', JSON.stringify({active: active}));
  io.sockets.emit('users', JSON.stringify({users: clientCount}));

  socket.on('login', function() {
    console.log('User %s authenticated');
  });

  socket.on('chat', function(msg) {
    console.log('message: ' + msg);

    io.emit('chat', msg);
  });

  socket.on('command', function(msg) {
    console.log('command: ' + msg);
  });

  socket.on('load', function(data) {
    console.log('Map requested');

    if (data && data.id) {
      data = JSON.parse(data);
    }

    // socket.emit('load');
  });

  socket.on('play', function(data) {
    console.log('Playing Audio');

    if (!data) {
      console.error('empty data');
      return;
    }

    io.sockets.emit('play', JSON.stringify({key: data.key}));
  });

  socket.on('disconnect', function(){
    console.log('User disconnected');
    clientCount -= 1;
  });
});


http.listen(SETTINGS.port, function(){
  console.log('listening on *:'+SETTINGS.port);
});
