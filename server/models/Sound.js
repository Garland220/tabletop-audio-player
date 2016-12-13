'use strict';

/**
 * Sound Model
 */
module.exports = {
  identity: 'sound',

  attributes: {
    /**
     * The name of the sound
     */
    name: {
      type: 'string',
      defaultsTo: ''
    },

    /**
     * Deleted?
     */
    deleted: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * Publicly visible?
     */
    public: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * User model of uploader
     */
    owner: {
      model: 'User'
    },

    /**
     * A description of the sound
     */
    description: {
      type: 'string'
    },

    /**
     * Category Sounds falls under
     */
    category: {
      type: 'string',
      defaultsTo: 'none'
    },

    /**
     * type = 'sound' or 'music'
     */
    type: {
      type: 'string',
      defaultsTo: 'sound'
    },

    tags: {
      type: 'json'
    },

    /**
     * Fixed delay between loops in milliseconds
     */
    loopDelay: {
      type: 'integer',
      defaultsTo: 0
    },

    /**
     * Upper value of random delay between loops in milliseconds
     */
    randomDelay: {
      type: 'integer',
      defaultsTo: 0
    },

    /**
     * Does the track loop?
     */
    loop: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * Use native loop instead of double buffered loop.
     *
     * This will not work with other loop options.
     */
    nativeLoop: {
      type: 'boolean',
      defaultsTo: false
    },

    /**
     * Base level for sound volume.
     */
    volume: {
      type: 'decimal',
      defaultsTo: 1.0
    },

    /**
     * URL of sound icon
     */
    picture: {
      type: 'string',
      defaultsTo: ''
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
