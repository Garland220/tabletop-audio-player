'use strict';

/**
 * This is the default settings.
 * You can override these by making a local.js file in this folder.
 */
module.exports = {
  port: 8080,

  log: {
    name: 'server',

    streams: [
      {
        level: 'debug',
        stream: process.stdout,
      },
      {
        level: 'error',
        path: './logs/error.log'
      },
      {
        level: 'info',
        path: './logs/info.log'
      }
    ]
  },


  waterline: {
    adapters: {
      sqlite3: require('waterline-sqlite3')
    },

    // Setup connections using the named adapter configs
    connections: {
      sqlite: {
        adapter: 'sqlite3',

        /**
         * Location of file
         */
        filename: './db/titan.db',

        /**
         * Set to true to output SQL queries
         */
        debug: false
      }
    },

    defaults: {
      connection: 'sqlite',
      migrate: 'safe'
    }
  },

  environment: process.env.NODE_ENV || 'development',
};
