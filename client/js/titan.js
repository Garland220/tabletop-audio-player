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

    masterVolume: 0.7,

    activeMusic: null,
    activeMusicVolume: 0.5,

    replayDelay: -0.25,

    id: null,

    context: null,


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
      audio.nativeLoop = data.nativeLoop || false;

      if (data.endTime && data.endTime < 0) {
        audio.endTime = audio.duration + data.endTime;
      }

      if (audio.nativeLoop) {
        audio.loop = 'loop';
      }
      else {
        if (data.doubleBuffer) {
          audio.doubleBuffer = data.doubleBuffer;
        }

        if (audio.loops && !audio.doubleBuffer && audio.randomDelay === 0 && audio.loopDelay === 0) {
          data.key = data.key + '_2';
          data.doubleBuffer = audio;
          audio.doubleBuffer = titan.loadAudio(data);
        }
      }

      // audio.addEventListener('load', titan.loadedFile, false);
      audio.addEventListener('canplaythrough', titan.loadedAudio, false);
      audio.addEventListener('loadedmetadata', titan.loadedMetadata, false);
      audio.addEventListener('timeupdate', titan.checkTime, false);

      return audio;
    },


    getSeed: function() {
      // charCodeAt
    },


    loadedMetadata: function(e) {
      var audio = e.target,
          key = audio.id;

      if (isNaN(audio.endTime)) {
        audio.endTime = audio.duration;
      }
    },


    loadedAudio: function(e) {
      if (titan.debug) {
        console.log(e);
      }
    },


    checkTime: function(e) {
      var audio = e.target,
          key = audio.id;

      if (titan.debug) {
        console.log(audio.loops, audio.currentTime, audio.duration, audio.duration - audio.currentTime);
      }

      if (audio.nativeLoop) {
        return;
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
      else if (!audio.loops && audio.currentTime >= audio.duration + titan.replayDelay) {
        var button = document.querySelector('button#' + key);
        if (button) {
          button.className = '';
        }
      }
    },


    addTracks: function(arr, data, callback) {
      if (Object.prototype.toString.call(arr) === '[object Array]') {
        for (var i=0; i<arr.length; i+=1) {
          titan.addTracks(arr[i]);
        }

        if (callback) {
          console.log(titan.players);
          callback();
        }

        window.dispatchEvent(new window.titanEvent('addTracks'));
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


    setCookie: function(name, value, maxAge) {
      maxAge = maxAge || 30 * 60 * 60 * 24;

      document.cookie = name + '=' + value + '; max-age=' + maxAge + '; path=/';
      console.log(name, value, maxAge, document.cookie);
    },


    getCookie: function(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');

      for (var i=0;i < ca.length;i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }

        if (c.indexOf(nameEQ) === 0) {
          return c.substring(nameEQ.length,c.length);
        }
      }

      return null;
    },


    deleteCookie: function(name) {
      titan.createCookie(name, '', -1);
    },


    setLoop: function(key, loop) {
      titan.players[key].loop = loop;
    },


    setVolume: function(key, volume) {
      titan.players[key].volume = volume;
    },


    changeVolume: function(e) {
      titan.masterVolume = e.target.value/10;

      titan.setCookie('volume', e.target.value);

      titan.updateMasterVolume();
    },


    updateMasterVolume: function() {
      for (var player in titan.players) {
        var audio = titan.players[player];

        if (audio.doubleBuffer) {
          audio.doubleBuffer.volume = audio.defaultVolume * titan.masterVolume;
        }
        audio.volume = audio.defaultVolume * titan.masterVolume;
      }

      titan.setMusicVolume(titan.activeMusicVolume);
    },


    setMusicVolume: function(volume) {
      titan.activeMusicVolume = volume;

      if (titan.activeMusic !== null) {
        titan.activeMusic.volume = titan.activeMusicVolume * titan.masterVolume;
      }

      window.dispatchEvent(new window.titanEvent('volumeChange'));
    },


    stop: function(key) {
      titan.players[key].stop();

      window.dispatchEvent(new window.titanEvent('stop', {key: key}));
    },


    pause: function(key) {
      titan.players[key].pause();

      window.dispatchEvent(new window.titanEvent('pause', {key: key}));
    },


    play: function(key) {
      if (!key) {
        console.error('Tried to play without key');
        return;
      }

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

      window.dispatchEvent(new window.titanEvent('play', {key: key}));
    },


    connect: function(id) {
      console.log('Connecting to server...');
      titan.el.innerHTML = 'Connecting to server...';

      if (!id) {
        console.error('ID not provided');
      }

      titan.id = id;

      titan.socket = io({query: 'channel='+id});

      titan.socket.on('connect', function() {
        titan.onConnected();
      });

      titan.socket.on('disconnect', function() {
        titan.onDisconnected(true);
      });

      titan.socket.on('load', function(response) {
        console.log('Loaded');
        console.log(response);
        response = JSON.parse(response);

        titan.addTracks(response, null, function() {
          titan.broadcast('load');
        });
      });

      titan.socket.on('users', function(response) {
        response = JSON.parse(response);
        titan.users = response.users;
        window.dispatchEvent(new window.titanEvent('users'));
        titan.el.innerHTML = 'Connected (' + titan.users + ')';
      });

      titan.socket.on('setVolume', function(response) {
        response = JSON.parse(response);
        titan.setVolume(response.key, response.volume);
        window.dispatchEvent(new window.titanEvent('setVolume'));
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


    onConnected: function() {
      titan.connected = true;

      titan.el.innerHTML = 'Connected';
      titan.players.connect.play();
      console.log('Connected');
      window.dispatchEvent(new window.titanEvent('connected'));
    },


    onDisconnected: function(reconnect) {
      if (!reconnect) {
        titan.socket.close();
      }

      titan.connected = false;

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
        console.error(exception);
      }
    },


    onStarted: function() {
    },


    start: function() {
      var AudioContext = window.AudioContext || window.webkitAudioContext,
          volume = titan.getCookie('volume');

      try {
        titan.context = new AudioContext();
      }
      catch(exception) {
        console.error(exception);
        window.alert(exception.message);
        return false;
      }

      if (volume && Number(volume) > 0) {
        titan.masterVolume = Number(volume) / 10;
        titan.updateMasterVolume();
      }
      document.getElementById('masterVolume').value = titan.masterVolume * 10;
      document.getElementById('masterVolume').addEventListener('change', titan.changeVolume, false);

      titan.onStarted();
    }

  };

  window.titanEvent = function(type, data) {
    var event = document.createEvent('Event');
    event.initEvent(type, true, true);
    event.data = data;
    return event;
  };

})();