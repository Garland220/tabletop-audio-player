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
        loop = audio.loop,
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


    start: function(buttons) {


      for (var i = 0; i < buttons.length; i+=1) {
        buttons[i].addEventListener('click', titan.admin.play, false);
      }
      // window.addEventListener('connected', function() { document.getElementById('musicVolume').value = titan.activeMusicVolume * 10; });
      document.getElementById('musicVolume').addEventListener('change', titan.admin.setMusicVolume, false);
      window.addEventListener('connected', function() {
        titan.socket.on('play', function(response) {
          response = JSON.parse(response);
          document.getElementById(response.key).className = 'active';
        });
        titan.socket.on('stop', function(response) {
          response = JSON.parse(response);
          document.getElementById(response.key).className = '';
        });
      });
    }

  };

})();