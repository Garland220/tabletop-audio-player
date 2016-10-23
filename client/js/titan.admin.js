(function() {
  'use strict';

  titan.admin = {

    setVolume: function(e) {
      titan.setVolume(e.target.id, e.target.value/10);
      titan.broadcast('setVolume', {key: e.target.id, volume: e.target.value/10});
    },


    setMusicVolume: function(e) {
      titan.setMusicVolume(e.target.value/10);
      titan.broadcast('setMusicVolume', {volume: e.target.value/10});
    },


    play: function(e) {
      if (e.target.tagName.toLowerCase() != 'button') {
        return false;
      }

      var audio = titan.players[e.target.id],
        type = audio.type,
        volume = audio.volume,
        loop = audio.loops,
        key = audio.id,
        data = {key: key, type: type, volume: volume, loop: loop};

      if (e.target.className == 'active') {
        titan.broadcast('stop', data);
        e.target.className = '';
      }
      else {
        titan.broadcast('play', data);
        e.target.className = 'active';
      }

      e.stopPropagation();
      return false;
    },


    playHandler: function(e) {
      var key = e.data.key;

      if (titan.players[key].type == 'music') {
        var els = document.querySelectorAll('#music .active');
        for (var i=0; i<els.length; i+=1) {
          els[i].className = '';
        }
      }

      document.getElementById(key).className = 'active';
    },


    stopHandler: function(e) {
      var key = e.data.key;
      document.getElementById(key).className = '';
    },


    start: function(buttons) {
      for (var i = 0; i < buttons.length; i+=1) {
        buttons[i].addEventListener('click', titan.admin.play, false);
      }

      document.getElementById('musicVolume').addEventListener('change', titan.admin.setMusicVolume, false);

      window.addEventListener('connected', titan.admin.connectedHandler, false);
      window.addEventListener('stop', titan.admin.stopHandler, false);
      window.addEventListener('play', titan.admin.playHandler, false);
    }

  };

})();