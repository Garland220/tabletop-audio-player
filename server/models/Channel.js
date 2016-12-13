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
      type: 'json'
    },

    audioLibrary: {
      type: 'json'
    },

    activeAudio: {
      type: 'json'
    },

    activeMusic: {
      type: 'json'
    },

    masterVolume: {
      type: 'decimal',
      defaultsTo: 0.7
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
