'use strict';

module.exports = {

  new: function(req, res) {
    let s3 = new server.aws.s3();

    s3.createMultipartUpload({}, function(err, reponse) {
      if (err) {
        server.log.error(err);
        server.log.debug(err.stack);

        s3.abortMultipartUpload({}, function(err, response2) {
          if (err) {
            server.log.error(err);
            server.log.debug(err.stack);
          }
        });

        server.log.info(response2);
      }

      server.log(response);

      s3.completeMultipartUpload({}, function(err, response) {
        if (err) {
          server.log.error(err);
          server.log.debug(err.stack);
        }

        server.log.info(response);

      });
    });
  },

  edit: function(req, res) {

  },

  save: function(req, res) {

  },

  view: function(req, res) {

  },

  list: function(req, res) {
    Sound.find().exec(function(err, results) {

    });
  }

};
