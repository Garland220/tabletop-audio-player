'use strict';

var bunyan = require('bunyan');

function Logger(settings) {
  this.log = bunyan.createLogger({
    name: settings.log,
    streams: [
      {
        stream: process.stdout,
        level: 'debug'
      },
      // {
      //   path: 'hello.log',
      //   level: 'trace'
      // }
    ]
  });
  this.log.info('Logger Initialized...');
}

module.exports = Logger;
