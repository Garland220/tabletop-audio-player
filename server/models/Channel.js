'use strict';

/**
 * Channel Model
 */
module.exports = {
  identity: 'channel',

  // connection: 'postgresdb'

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
     * Automatic field. Date time created.
     */
    created: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
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
    },


    /**
     * Automatic field, updates when row is touched.
     *  Used to debugging issues.
     */
    ts: {
      type: 'datetime',
      defaultsTo: function () {
        return new Date();
      }
    },
  }
};
