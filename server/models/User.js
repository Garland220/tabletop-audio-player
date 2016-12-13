'use strict';

/**
 * User Model
 */
module.exports = {
  identity: 'user',

  attributes: {
    /**
     * User's First name
     */
    firstName: {
      type: 'string',
      defaultsTo: ''
    },

    /**
     * User's last name
     */
    lastName: {
      type: 'string',
      defaultsTo: ''
    },

    /**
     * A URL pointing to the location of the User's profile picture
     */
    picture: {
      type: 'string',
      defaultsTo: ''
    },

    /**
     * Timestamp for when this entity was last active.
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
