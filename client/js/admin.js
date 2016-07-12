(function() {
  'use strict';

  var container = document.getElementById('Sounds');

  function setVolume(e) {
    titan.setVolume(e.target.id, e.target.value/10);
    titan.broadcast('setVolume', {key: e.target.id, volume: e.target.value/10});
  }

  function setMusicVolume(e) {
    titan.setMusicVolume(e.target.value/10);
    titan.broadcast('setMusicVolume', {volume: e.target.value/10});
  }

  function playSound(e) {
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
  }

  window.addEventListener('connected', function() {
    //- document.getElementById('musicVolume').value = titan.activeMusicVolume * 10;
  });

  document.getElementById('musicVolume').addEventListener('change', setMusicVolume, false);
  for (var i = 0; i < container.children.length; i+=1) {
    container.children[i].addEventListener('click', playSound, false);
  }

})();