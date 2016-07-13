//
// Titan Audio Engine
//

(function() {
  'use strict';

  window.titan = {

    debug: false,

    connected: false,
    users: 0,

    el: null,

    tracks: [],
    players: {},

    activeMusic: null,
    activeMusicVolume: 0.5,


    loadAudio: function(url, key, type, volume, loop) {
      var audio = new Audio();
      volume = volume || 0.5;
      loop = loop || false;
      if (loop) {
        audio.loop = 'loop';
      }
      audio.id = key;
      audio.src = url;
      audio.type = type;
      audio.volume = volume;
      audio.preload = 'auto';
      audio.addEventListener('canplaythrough', titan.audioLoaded, false);
      audio.addEventListener('ended', titan.checkLoop, false);
      titan.players[key] = audio;
    },


    audioLoaded: function(e) {
      if (titan.debug) {
        console.log(e);
      }
    },


    checkLoop: function(e) {
      var audio = e.target,
          key = audio.id;

      if (!audio.loop) {

      }
    },


    addTracks: function(arr, index, type, volume, loop) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        for (var i=0; i<arr.length; i+=1) {
          titan.addTracks(arr[i]);
        }
      }
      else if (Object.prototype.toString.call(arr) === '[object Object]') {
        titan.addTracks(arr.url, arr.key, arr.type, arr.volume, arr.loop);
      }
      else {
        var obj = {};
        if (!index) {
          index = arr.match(/[^\\/]+$/)[0];
        }

        obj[index] = arr;
        titan.tracks.push(obj);
        titan.loadAudio(arr, index, type, volume, loop);
      }
    },


    setLoop: function(key, loop) {
      titan.players[key].loop = loop;
    },


    setVoume: function(key, volume) {
      titan.players[key].volume = volume;
    },


    setMusicVolume: function(volume) {
      titan.activeMusicVolume = volume;

      if (titan.activeMusic !== null) {
        titan.activeMusic.volume = titan.activeMusicVolume;
      }
    },


    stop: function(key) {
      titan.players[key].pause();
      titan.players[key].currentTime = 0;
    },


    pause: function(key) {
      titan.players[key].pause();
    },


    play: function(key) {
      if (titan.players[key].type == 'music') {
        if (titan.activeMusic !== null) {
          titan.stop(titan.activeMusic.id);
        }
        titan.activeMusic = titan.players[key];
        titan.activeMusic.volume = titan.activeMusicVolume;
      }
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
      titan.socket.on('setVolume', function(response) {
        response = JSON.parse(response);
        titan.setVolume(response.key, response.volume);
      });
      titan.socket.on('setMusicVolume', function(response) {
        console.log('Adjusting Music Volume');
        response = JSON.parse(response);
        titan.setMusicVolume(response.volume);
      });
      titan.socket.on('stop', function(response) {
        console.log('Stopping audio');
        response = JSON.parse(response);
        titan.stop(response.key);
      });
      titan.socket.on('play', function(response) {
        console.log('Playing audio');
        response = JSON.parse(response);
        titan.play(response.key);
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


    broadcast: function(type, data) {
      try {
        titan.socket.emit(type, data);
      }
      catch(exception) {
        console.log(exception, 2);
      }
    },

    start: function() {

    }

  };

})();