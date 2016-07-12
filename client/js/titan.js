//
// Titan Audio Engine
//

(function() {
  'use strict';

  window.titan = {

    connected: false,
    users: 0,

    el: null,

    tracks: [],
    players: {},


    loadAudio: function(url, key, volume, loop) {
      var audio = new Audio();
      volume = volume || 0.5;
      loop = loop || false;
      if (loop) {
        audio.loop = 'loop';
      }
      audio.id = key;
      audio.src = url;
      audio.volume = volume;
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', titan.audioLoaded, false);
      audio.addEventListener('ended', titan.checkLoop, false);
      titan.players[key] = audio;
    },


    audioLoaded: function(e) {
      console.log(e);
    },


    checkLoop: function(e) {
      var audio = e.target,
          key = audio.id;

      if (audio.loop) {

      }
    },


    addTracks: function(arr, index, type, loop) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        for (var i=0; i<arr.length; i+=1) {
          titan.addTracks(arr[i]);
        }
      }
      else if (Object.prototype.toString.call(arr) === '[object Object]') {
        titan.addTracks(arr.url, arr.key, arr.type, arr.loop);
      }
      else {
        var obj = {};
        if (!index) {
          index = arr.match(/[^\\/]+$/)[0];
        }
        obj[index] = arr;
        titan.tracks.push(obj);
        titan.loadAudio(arr, index, 0.5, loop);
      }
    },


    setLoop: function(key, loop) {
      titan.players[key].loop = loop;
    },


    setVoume: function(key, volume) {
      titan.players[key].volume = volume;
    },


    stop: function(key) {
      titan.players[key].stop();
    },


    play: function(key) {
      titan.players[key].play();
    },


    connect: function() {
      console.log('Connecting...');

      titan.socket = io();
      titan.socket.on('connect', function() {
        console.log('Connected');
        titan.el.innerHTML = 'Connected';
        titan.players.connect.play();
        window.dispatchEvent(new Event('connected'));
      });
      titan.socket.on('disconnect', function() {
        titan.disconnect(true);
      });
      titan.socket.on('load', function(response) {
        console.log('Loaded');
        response = JSON.parse(response);
      });
      titan.socket.on('users', function(response) {
        response = JSON.parse(response);
        titan.users = response.users;
        titan.el.innerHTML = 'Connected - ' + titan.users + ' active user(s)';
      });
      titan.socket.on('stop', function(response) {
        console.log('Stopping audio');
        response = JSON.parse(response);
        titan.players[response.key].stop();
      });
      titan.socket.on('play', function(response) {
        console.log('Playing audio');
        response = JSON.parse(response);
        titan.players[response.key].play();
      });

    },


    disconnect: function(reconnect) {
      if (!reconnect) {
        titan.socket.close();
      }
      titan.el.innerHTML = 'Disconnected';
      titan.players.disconnect.play();
      console.log('Disconnected.');
      window.dispatchEvent(new Event('disconnected'));
    },


    send: function(type, data) {
      if (data === '') {
        console.log('Please enter a message', 1);
        return false;
      }

      try {
        titan.socket.emit(type, data);
        console.log('Sent: ' + data, 0);
      }
      catch(exception) {
        console.log(exception, 2);
      }
    },

  };

  var tracks = [
    {url: 'audio/sound/connect.wav', key: 'connect', type: 'sound', loop: false},
    {url: 'audio/sound/disconnect.wav', key: 'disconnect', type: 'sound', loop: false},
    {url: 'audio/sound/crowd_cheer2.ogg', key: 'critical', type: 'sound', loop: false},
    {url: 'audio/music/music_eerie_flute1.ogg', key: 'eerieFlute1', type: 'music', loop: true},
    {url: 'audio/music/hurdy_gurdy2.ogg', key: 'hurdyGurdy2', type: 'music', loop: true},
  ];

  window.onload = (function() {
    var div = document.createElement('div');
    div.id = 'connection';
    div.innerHTML = 'Connecting...';
    document.body.appendChild(div);
    titan.el = div;

    titan.addTracks(tracks);
    titan.connect();
  });

})();