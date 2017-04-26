
//
// Titan Audio Engine
//
'use strict';

;(function() {

  titan.audio = {
    createSound: function(data) {
      var sound = new TitanSound();

      return sound;
    }
  };
})();


/**
 * Raw audio
 */
function TitanSound() {

  this.id = 0;
  this.name = '';
  this.key = '';
  this.url = '';

  this.category = 'default';
  this.type = 'sound';
  this.tags = [];

  this.volume = 1.0;

  this.loop = false;
  this.nativeLoop = false;
  this.loopDelay = 0;
  this.randomDelay = 0;

  this.startTime = 0.0;
  this.endTime = 0.0;

  this.attribution = '';
  this.picture = '';
  this.icon = '';

  this.loaded = false;
  this.playing = false;
  this.source = null;
  this.sound = null;


  this.play = function() {
    if (this.endTime === 0.0) {
      this.endTime = this.sound.duration - this.startTime;
    }

    this.source.start(0.0, this.startTime, this.endTime);
  };

  this.stop = function() {
    this.source.disconnect();
    this.source = null;
    this.source = titan.context.createBufferSource();
    this.source.buffer = this.sound;
    this.source.loop = false;
  };

  this.load = function() {
    var request = new XMLHttpRequest();

    request.onload = function() {
      this.sound = titan.context.createBuffer(request.response, false);
      this.source = titan.context.createBufferSource();
      this.source.buffer = this.sound;
      this.source.loop = this.loop;

      if (this.endTime < 0) {
        this.endTime = this.sound.duration + this.endTime;
      }
    };

    request.open('GET', this.url, true);
    request.responseType = 'arraybuffer';

    request.send();
  };

  this.init = function(data) {
    this.id = data.id;
    this.name = data.name;
    this.key = data.key || '';
    this.url = data.url || '';

    this.category = data.category || 'default';
    this.type = data.type || 'sound';
    this.tags = data.tags || [];

    this.volume = data.volume || 1.0;

    this.loop = data.loop || false;
    this.nativeLoop = data.nativeLoop || false;
    this.loopDelay = data.loopDelay || 0;
    this.randomDelay = data.randomDelay || 0;

    this.startTime = data.startTime || 0.0;
    this.endTime = data.endTime || 0.0;

    this.attribution = data.attribution || '';
    this.picture = data.picture || '';
    this.icon = data.icon || '';

    this.load();
  };

  this.toJSON = function() {
    return JSON.stringify(this);
  };
}


/**
 * Module audio
 */
function TitanSoundSprite() {

  this.toJSON = function() {
    return JSON.stringify(this);
  };
}


/**
 * Native audio
 */
function NativeSound() {

  this.id = 0;
  this.name = '';
  this.key = '';
  this.url = '';

  this.category = 'default';
  this.type = 'sound';
  this.tags = [];

  this.volume = 1.0;

  this.loop = false;
  this.nativeLoop = false;
  this.loopDelay = 0;
  this.randomDelay = 0;

  this.startTime = 0.0;
  this.endTime = 0.0;

  this.attribution = '';
  this.picture = '';
  this.icon = '';

  this.playing = false;
  this.sound = null;


  this.play = function() {
    this.sound.play();
  };

  this.pause = function() {
    this.sound.pause();
  };

  this.stop = function() {
    this.sound.pause();
    this.sound.currentTime = 0;

    if (this.sound.doubleBuffer) {
      this.sound.doubleBuffer.pause();
      this.sound.doubleBuffer.currentTime = 0;
    }
  };

  this.load = function() {

  };

  this.init = function(data) {
    this.sound = new Audio();

    this.sound.id = data.key;
    this.sound.src = data.url;
    this.sound.loops = data.loop || false;
    this.sound.preload = data.preload || 'metadata';
    this.sound.volume = data.volume || 0.5;

    this.volume = data.volume || 0.5;
    this.type = data.type || 'sound';
    this.category = data.category || 'default';
    this.endTime = data.endTime || this.sound.duration;
    this.startTime = data.startTime || 0;
    this.randomDelay = data.randomDelay || 0;
    this.loopDelay = data.loopDelay || 0;
    this.nativeLoop = data.nativeLoop || false;

    if (data.endTime && data.endTime < 0) {
      this.endTime = this.sound.duration + data.endTime;
    }

    if (this.sound.nativeLoop) {
      this.sound.loop = 'loop';
    }
    else {
      if (data.doubleBuffer) {
        this.sound.doubleBuffer = data.doubleBuffer;
      }

      if (this.sound.loops && !this.sound.doubleBuffer && this.sound.randomDelay === 0 && this.sound.loopDelay === 0) {
        data.key = data.key + '_2';
        data.doubleBuffer = this.sound;
        this.sound.doubleBuffer = titan.loadAudio(data);
      }
    }

    // audio.addEventListener('load', titan.loadedFile, false);
    this.sound.addEventListener('canplaythrough', titan.loadedAudio, false);
    this.sound.addEventListener('loadedmetadata', titan.loadedMetadata, false);
    this.sound.addEventListener('timeupdate', titan.checkTime, false);

    this.load();
  };

  this.toJSON = function() {
    return JSON.stringify(this);
  };
}
