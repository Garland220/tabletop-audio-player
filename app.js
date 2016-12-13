'use strict';

const fs = require('fs'),

merge = require('deepmerge'),

server = require('./server/server');

let SETTINGS = require('./server/config/settings');

/**
 * Locates local configuration file,
 *  and passes merged settings into service constructor.
 */
fs.exists(__dirname + '/server/config/local.js', function(exists) {
  if (exists) {
    SETTINGS = merge(SETTINGS, require('./server/config/local.js'));
  }

  server.setup(SETTINGS);
});
