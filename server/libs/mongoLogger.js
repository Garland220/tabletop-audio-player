'use strict';

var MongoClient = require('mongodb').MongoClient;

function Logger(options) {
  var self = this;
  self.options = options;

  self.logLevels = {
    'trace': 10,
    'debug': 20,
    'info': 30,
    'warn': 40,
    'error': 50,
    'fatal': 60
  };

  MongoClient.connect(self.options.mongo.url, function(err, connection) {
    self.connection = connection;
    self.collection = self.connection.collection(self.options.mongo.collection);
    self.batch = self.collection.initializeOrderedBulkOp();
  });

  self.log = function(data) {
    var row = {data: data};
    self.batch.insert(row);
    console.log(row);
  };

  self.close = function() {
    self.batch.execute(function(err, result) {
      if (err) {
        console.error(err);
        throw new Error(err);
      }
      console.log(result);
      self.connection.close();
    });
  };
}

exports.Logger = Logger;
