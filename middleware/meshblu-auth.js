var request = require('request');
var basicAuth = require('basic-auth');
var config = require('../config/config');

module.exports =  {
    authenticate : function(req, res, next){
      var meshbluUser = basicAuth(req);

      if(!meshbluUser){
        next(new Error('No Credentials Given!'));
      }

      request({
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Octoblu',
          'x-li-format': 'json'
        },
        followAllRedirects: true,
        method: 'GET',
        uri: req.protocol + "://" + config.meshblu.server + ':' + config.meshblu.port +  "/authenticate/" + meshbluUser.name,
        qs: {
          token: meshbluUser.pass
        }

      }, function(err, response, body) {
        if (err) {
          next(err);
          return;
        }
        next(null, body)
      });
    }
};

