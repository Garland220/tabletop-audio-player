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


    loadAudio: function(data) {
      var audio = new Audio(),
        loop = data.loop || false;

      if (loop) {
        audio.loop = 'loop';
      }
      audio.id = data.key;
      audio.src = data.url;
      audio.preload = data.preload || 'auto';
      audio.volume = data.volume || 0.5;
      audio.type = data.type || 'sound';
      audio.category = data.category || 'misc';

      audio.addEventListener('canplaythrough', titan.audioLoaded, false);
      audio.addEventListener('ended', titan.checkLoop, false);
      titan.players[data.key] = audio;
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


    addTracks: function(arr, data) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        for (var i=0; i<arr.length; i+=1) {
          titan.addTracks(arr[i]);
        }
      }
      else if (Object.prototype.toString.call(arr) === '[object Object]') {
        var obj = {};
        if (!arr.key) {
          arr.key = arr.key.match(/[^\\/]+$/)[0];
        }

        obj[arr.key] = arr;
        titan.tracks.push(obj);
        titan.loadAudio(arr);
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