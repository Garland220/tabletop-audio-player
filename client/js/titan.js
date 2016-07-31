//
// Titan Audio Engine
//

(function() {
  'use strict';

  window.titan = {

    debug: true,

    connected: false,
    users: 0,

    el: null,

    tracks: [],
    players: {},

    masterVolume: 1.0,

    activeMusic: null,
    activeMusicVolume: 0.5,

    replayDelay: -0.30,


    loadAudio: function(data) {
      var audio = new Audio();

      audio.id = data.key;
      audio.src = data.url;
      audio.loops = data.loop || false;
      audio.preload = data.preload || 'metadata';
      audio.volume = data.volume || 0.5;
      audio.defaultVolume = data.volume || 0.5;
      audio.type = data.type || 'sound';
      audio.category = data.category || 'misc';
      audio.endTime = data.endTime || audio.duration;
      audio.startTime = data.startTime || 0;
      audio.randomDelay = data.randomDelay || 0;
      audio.loopDelay = data.loopDelay || 0;

      if (data.endTime && data.endTime < 0) {
        audio.endTime = audio.duration + data.endTime;
      }

      if (data.doubleBuffer) {
        audio.doubleBuffer = data.doubleBuffer;
      }

      audio.addEventListener('canplaythrough', titan.audioLoaded, false);
      // audio.addEventListener('loadedmetadata', titan.setMetadata, false);
      audio.addEventListener('timeupdate', titan.checkTime, false);
      // audio.addEventListener('load', titan.postLoad, false);
      // audio.addEventListener('ended', titan.checkLoop, false);

      if (audio.loops && !audio.doubleBuffer && audio.randomDelay === 0 && audio.loopDelay === 0) {
        data.key = data.key + '_2';
        data.doubleBuffer = audio;
        audio.doubleBuffer = titan.loadAudio(data);
      }

      return audio;
    },


    setMetadata: function(e) {
      var audio = e.audio,
          key = audio.id;

      if (isNaN(audio.endTime)) {
        audio.endTime = audio.duration;
      }
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
      else if (audio.loopDelay && audio.loopDelay > 0) {
        setTimeout(function() {

        }, audio.loopDelay);
      }
    },


    checkTime: function(e) {
      var audio = e.target,
          key = audio.id;

      if (titan.debug) {
        console.log(audio.loops, audio.currentTime, audio.duration, audio.duration - audio.currentTime);
      }

      if (audio.loops && audio.currentTime >= audio.duration + titan.replayDelay) {
        if (audio.loopDelay > 0 || audio.randomDelay > 0) {
          var buffer = 0;
          if (audio.loopDelay > 0) {
            buffer += audio.loopDelay;
          }
          if (audio.randomDelay > 0) {
            buffer = titan.getRandomInt(0, audio.randomDelay);
          }

          if (titan.debug) {
            console.log('Delaying audio: ' + buffer);
          }

          setTimeout(function() {
            if (titan.debug) {
              console.log('Playing delayed audio: ' + audio.key);
            }
            audio.play();
          }, buffer);
        }
        else {
          audio.doubleBuffer.play();
        }
        audio.pause();
        audio.currentTime = audio.startTime;
      }
      else if (!audio.loops && audio.currentTime > audio.duration) {
        var button = document.querySelector('button#' + key);
        if (button) {
          button.className = '';
        }
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
        titan.players[arr.key] = titan.loadAudio(arr);
      }
    },


    getRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    },


    setLoop: function(key, loop) {
      titan.players[key].loop = loop;
    },


    setVoume: function(key, volume) {
      titan.players[key].volume = volume;
    },


    setMasterVolume: function(e) {
      console.log('test');
      titan.masterVolume = e.target.value/10;
      titan.setMusicVolume(titan.activeMusicVolume);

      for (var player in titan.players) {
        var audio = titan.players[player];
        audio.volume = audio.defaultVolume * titan.masterVolume;
      }
    },


    setMusicVolume: function(volume) {
      titan.activeMusicVolume = volume;

      if (titan.activeMusic !== null) {
        titan.activeMusic.volume = titan.activeMusicVolume * titan.masterVolume;
      }
    },


    stop: function(key) {
      titan.players[key].pause();
      titan.players[key].currentTime = 0;

      if (titan.players[key].doubleBuffer) {
        titan.players[key].doubleBuffer.pause();
        titan.players[key].doubleBuffer.currentTime = 0;
      }
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
        titan.activeMusic.volume = titan.activeMusicVolume * titan.masterVolume;
      }
      if (titan.players[key].doubleBuffer) {
        titan.players[key].doubleBuffer.load();
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
      document.getElementById('masterVolume').addEventListener('change', titan.setMasterVolume, false);
    }

  };

})();