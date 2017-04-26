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

        server.log.debug(response2);
      }

      server.log.debug(response);

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
    res.render('sound/edit');
  },

  save: function(req, res) {

  },

  view: function(req, res) {

  },

  import: function(req, res) {
    const payload = req.params.json;

    for (var i=0; i<payload.length; i+=1) {
      var sound = payload[i];

      var obj = server._({}, {name: payload.name, description: payload.description});

      Sound.create().exec(function(err, result) {

      });
    }
  },

  list: function(req, res) {
    Sound.find().exec(function(err, results) {

    });
  }
};
