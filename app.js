'use strict';

// const _ = require('lodash'),

// fs = require('fs'),

// server = require('./server/server');

// let SETTINGS = require('./server/config/settings');

/**
 * Locates local configuration file,
 *  and passes merged settings into service constructor.
 */
// fs.exists(__dirname + '/server/config/local.js', function(exists) {
//   if (exists) {
//     SETTINGS = _.merge(SETTINGS, require('./server/config/local.js'));
//   }

//   server.setup(SETTINGS);
// });


const Server = require('./server/build/Server').Server;
Server.Start();
