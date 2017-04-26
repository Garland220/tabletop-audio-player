'use strict';

/**
 * Category Model
 */
module.exports = {
  identity: 'category',

  attributes: {
    name: {
      type: 'string',
      defaultsTo: 'New Category'
    },

    description: {
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

    picture: {
      type: 'string',
      defaultsTo: ''
    },

    color: {
      type: 'string',
      defaultsTo: ''
    }
  },

  beforeCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  }
};
