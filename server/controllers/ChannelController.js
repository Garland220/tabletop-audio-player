'use strict';

module.exports = {

  new: function(req, res) {
    let debug = req.query.debug;

    Channel.create({}, function(err, result) {
      if (err) {
        server.log.error(err);
        return res.status(500).render('500');
      }

      if (debug) {
        result.picture = '/images/ravenloft_crest.png';
        result.name = 'The Curse of Strahd';
        result.description = 'Under raging storm clouds, a lone figure stands silhouetted against the ancient walls of Castle Ravenloft. The vampire Count Strahd von Zarovich stares down a sheer cliff at the village below. A cold, bitter wind spins dead leaves about him, billowing his cape in the darkness.';
        result.adminKey = '1';
        result.save();
      }

      server.channels[result.id] = result;

      res.redirect('/channel/' + result.id);
    });
  },


  addSound: function(req, res) {

  },


  removeSound: function(req, res) {

  },


  admin: function(req, res) {
    let id = req.params.id;

    if (!id) {
      server.log.error('Requested page without ID');
      return res.status(500).render('500');
    }

    Channel.findOne({id: id}, function(err, result) {
      if (err) {
        server.log.error(err);
        return res.status(500).render('500');
      }

      if (!result) {
        return res.status(404).render('404');
      }

      if (req.query.key && req.query.key == result.adminKey) {
        server.log.info('Admin Key Accepted for channel {0}'.format(id));
        res.render('admin', {channel: result, sounds: result.audioLibrary});
      }
      else {
        server.log.error('Wrong admin key {0} tried for channel {1}.'.format(req.query.key, id));
        return res.status(403).render('403');
      }
    });
  },


  edit: function(req, res) {
    let id = req.params.id,
      audioLibrary = req.params.audioLibrary;

    if (!id) {
      server.log.error('Requested page without ID');
      return res.status(500).render('500');
    }

    Channel.findOne({id: id}, function(err, result) {
      if (err) {
        server.log.error(err);
        return res.status(500).render('500');
      }

      if (!result) {
        return res.status(404).render('404');
      }

      if (req.query.key && req.query.key == result.adminKey) {
        server.log.info('Admin Key Accepted for channel {0}'.format(id));
        result.audioLibrary = JSON.stringify(result.audioLibrary);

        res.status(200).render('edit', {channel: result});
      }
      else {
        server.log.error('Wrong admin key {0} tried for channel {1}.'.format(req.query.key, id));
        return res.status(403).render('403');
      }
    });
  },


  save: function(req, res) {
    let id = req.params.id,
      name = req.body.name,
      description = req.body.description,
      picture = req.body.picture,
      audioLibrary = req.body.audioLibrary;

    if (!id) {
      server.log.error('Requested page without ID');
      return res.status(500).render('500');
    }

    Channel.update({id: id},{name: name, description: description, picture: picture, audioLibrary: audioLibrary}).exec(function(err, result) {
      if (err) {
        server.log.error(err);
        return res.status(500).render('500');
      }

      if (!result) {
        return res.status(404).render('404');
      }

      res.redirect('/channel/' + id);
    });
  },


  view: function(req, res) {
    let id = req.params.id;

    if (!id) {
      server.log.error('Requested page without ID');
      return res.status(500).render('500');
    }

    Channel.findOne({id: id}, function(err, result) {
      if (err) {
        server.log.error(err);
        return res.status(500).render('500');
      }

      if (!result) {
        return res.status(404).render('404');
      }

      res.render('channel', {channel: result});
    });
  }
};
