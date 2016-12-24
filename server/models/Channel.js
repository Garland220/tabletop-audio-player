'use strict';

/**
 * Channel Model
 */
module.exports = {
  identity: 'channel',

  associations: [{
    alias: ['User']
  }],

  attributes: {

    admin: {
      model: 'User'
    },

    adminKey: {
      type: 'string',
      defaultsTo: ''
    },

    userKey: {
      type: 'string',
      defaultsTo: ''
    },

    customUrl: {
      type: 'string',
      defaultsTo: ''
    },

    deleted: {
      type: 'boolean',
      defaultsTo: true
    },

    public: {
      type: 'boolean',
      defaultsTo: false
    },

    name: {
      type: 'string',
      defaultsTo: 'New Channel'
    },

    description: {
      type: 'string',
      defaultsTo: ''
    },

    picture: {
      type: 'string',
      defaultsTo: ''
    },

    style: {
      type: 'json',
      defaultsTo: {}
    },

    audioLibrary: {
      type: 'json',
      defaultsTo: {}
    },

    activeAudio: {
      type: 'json',
      defaultsTo: {}
    },

    activeMusic: {
      type: 'json',
      defaultsTo: {}
    },

    masterVolume: {
      type: 'float',
      defaultsTo: 0.75
    },

    /**
     * Timestamp for when this entity was last active.
     *  Used for pruning.
     */
    lastActivity: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    }
  },

  beforeCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  }
};
