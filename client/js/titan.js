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

  };

  var tracks = [
    // UI Sounds
    {url: 'audio/sound/connect.ogg', key: 'connect', type: 'sound', loop: false},
    {url: 'audio/sound/disconnect.ogg', key: 'disconnect', type: 'sound', loop: false},

    // Fun Sounds
    {url: 'audio/sound/crowd_cheer2.ogg', key: 'critical', type: 'sound', volume: 0.3, loop: false},
    {url: 'audio/sound/the-price-is-right-losing-horn.ogg', key: 'criticalMiss', type: 'sound', volume: 0.2, loop: false},
    {url: 'audio/sound/toasty.ogg', key: 'toasty', type: 'sound', volume: 1.0, loop: false},
    {url: 'audio/sound/levelup.ogg', key: 'levelup', type: 'sound', volume: 1.0, loop: false},

    // Environment Sounds
    {url: 'audio/sound/stream.ogg', key: 'stream1', type: 'sound', loop: true},
    {url: 'audio/sound/stream1_lp.ogg', key: 'stream2', type: 'sound', loop: true},
    {url: 'audio/sound/rain1_lp.ogg', key: 'rain1', type: 'sound', loop: true},
    {url: 'audio/sound/rain2_lp.ogg', key: 'rain2', type: 'sound', loop: true},
    {url: 'audio/sound/rain3_lp.ogg', key: 'rain3', type: 'sound', loop: true},
    {url: 'audio/sound/rain_outside.ogg', key: 'rainOutside', type: 'sound', loop: true},
    {url: 'audio/sound/rain_on_roofb.ogg', key: 'rainRoof', type: 'sound', loop: true},
    {url: 'audio/sound/breeze.ogg', key: 'breeze', type: 'sound', loop: true},
    {url: 'audio/sound/wind1_lp.ogg', key: 'wind1', type: 'sound', loop: true},
    {url: 'audio/sound/wind2_lp.ogg', key: 'wind2', type: 'sound', loop: true},
    {url: 'audio/sound/gale3a.ogg', key: 'wind3', type: 'sound', loop: true},
    {url: 'audio/sound/wind_outside.ogg', key: 'windOutside', type: 'sound', loop: true},
    {url: 'audio/sound/thunder1.ogg', key: 'thunder1', type: 'sound', loop: true},
    {url: 'audio/sound/thunder2.ogg', key: 'thunder2', type: 'sound', loop: false},

    // Prop sounds
    {url: 'audio/sound/torches.ogg', key: 'torches', type: 'sound', loop: true},
    {url: 'audio/sound/campfire1_lp.ogg', key: 'campfire', type: 'sound', loop: true},
    {url: 'audio/sound/fireplace_loop_c.ogg', key: 'fireplace', type: 'sound', loop: true},
    {url: 'audio/sound/flag_wind.ogg', key: 'flagWind', type: 'sound', loop: true},

    // Horror Sounds
    {url: 'audio/sound/heartbeat.ogg', key: 'heartbeat1', type: 'sound', loop: true},
    {url: 'audio/sound/heartbeat2.ogg', key: 'heartbeat2', type: 'sound', loop: true},
    {url: 'audio/sound/knife_sharpening.ogg', key: 'knifeSharpen', type: 'sound', loop: false},
    {url: 'audio/sound/wolf_howl1.ogg', key: 'wolfHowl', type: 'sound', loop: false},
    {url: 'audio/sound/hawk1.ogg', key: 'hawk', type: 'sound', loop: false},
    {url: 'audio/sound/flies.ogg', key: 'flies', type: 'sound', loop: true},
    {url: 'audio/sound/bats.ogg', key: 'bats', type: 'sound', loop: false},
    {url: 'audio/sound/church_bell.ogg', key: 'churchBell', type: 'sound', loop: false},
    {url: 'audio/sound/door_open.ogg', key: 'doorOpen', type: 'sound', loop: false},
    {url: 'audio/sound/door_close.ogg', key: 'doorClose', type: 'sound', loop: false},
    {url: 'audio/sound/wail.ogg', key: 'wail', type: 'sound', loop: false},
    {url: 'audio/sound/pianohit.ogg', key: 'pianohit', type: 'sound', loop: false},
    {url: 'audio/sound/whispers1.ogg', key: 'whispers1', type: 'sound', loop: false},
    {url: 'audio/sound/whispers2x.ogg', key: 'whispers2', type: 'sound', loop: false},
    {url: 'audio/sound/vortex.ogg', key: 'vortex', type: 'sound', loop: false},

    // Combat Sounds
    {url: 'audio/sound/back_stab.ogg', key: 'stab', type: 'sound', loop: false},
    {url: 'audio/sound/bow_single_shot.ogg', key: 'bow', type: 'sound', loop: false},
    {url: 'audio/sound/club_attack.ogg', key: 'club', type: 'sound', loop: false},
    {url: 'audio/sound/heal_spell_1a.ogg', key: 'heal', type: 'sound', loop: false},

    // Music
    {url: 'audio/music/music_1.ogg', key: 'music1', type: 'music', loop: true},
    {url: 'audio/music/music_3a.ogg', key: 'music3', type: 'music', loop: true},
    {url: 'audio/music/siren_song_lp.ogg', key: 'sirenSong', type: 'music', loop: true},
    {url: 'audio/music/music_eerie_flute1.ogg', key: 'eerieFlute1', type: 'music', loop: true},
    {url: 'audio/music/music_forest_action1.ogg', key: 'forestAction1', type: 'music', loop: true},
    {url: 'audio/music/celtic_harp_choir2.ogg', key: 'celticHarpChoir', type: 'music', loop: true},
    {url: 'audio/music/city_wonder_cue_a.ogg', key: 'cityWonder', type: 'music', loop: true},
    {url: 'audio/music/hurdy_gurdy2.ogg', key: 'hurdyGurdy2', type: 'music', loop: true},
    {url: 'audio/music/lute_ballad.ogg', key: 'luteBallad', type: 'music', loop: true},
    {url: 'audio/music/combat1.ogg', key: 'combat1', type: 'music', loop: true},
    {url: 'audio/music/music_forest_combat1.ogg', key: 'combat2', type: 'music', loop: true},
    {url: 'audio/music/drum_music_1c.ogg', key: 'combat3', type: 'music', loop: true},
    {url: 'audio/music/Toccata_and_Fugue_in_D_minor.ogg', key: 'tocattaFugue', type: 'music', loop: true},
    {url: 'audio/music/Harpsichord_Concerto.ogg', key: 'harpsichordConcerto', type: 'music', loop: true},
  ];

  window.onload = (function() {
    var div = document.createElement('div');
    div.id = 'connection';
    div.innerHTML = 'Connecting...';
    document.getElementById('connection').appendChild(div);
    titan.el = div;

    titan.addTracks(tracks);
    titan.connect();
  });

})();