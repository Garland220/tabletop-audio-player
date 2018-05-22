'use strict';

const fs = require('fs');
const Reflect = require('./server/node_modules/reflect-metadata');
const Server = require('./server/build').Server;


/**
 * Locates local configuration file,
 *  and passes merged settings into service constructor.
 */
fs.exists(__dirname + '/server/config/local.js', function(exists) {
  if (exists) {
    const local = require('./server/config/local');
    Server.Start(local);
  }
  else {
    Server.Start();
  }
});
