'use strict';

/**
 * This is the default settings.
 * You can override these by making a local.js file in this folder.
 */
module.exports = {
  // Webserver listening port
  port: 8080,

  // Environment setting
  environment: process.env.NODE_ENV || 'development',

  // Log configuration
  log: {
    name: 'server',

    streams: [
      {
        level: 'info',
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

  // Template configuration
  view: {
    engine: 'hbs',
    location: 'client/views',
    options: {
      layout: true
    }
  },

  models: [
    {
      name: 'User',
      path: 'User.js'
    },
    {
      name: 'Sound',
      path: 'Sound.js'
    },
    {
      name: 'Channel',
      path: 'Channel.js'
    }
  ],

  // Database configuration
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
      migrate: 'alter'
    }
  }
};
