'use strict';

var bunyan = require('bunyan');

function Logger(settings) {
  this.log = bunyan.createLogger(settings.log);
  this.log.info('Logger Initialized...');
}

module.exports = Logger;
