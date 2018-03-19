const fs = require('fs');
const https = require('https');
const Q = require('kew');
const SymConfigLoader = require('../SymConfigLoader');

var SymBotAuth = {};

SymBotAuth.authenticate = (symConfig) => {

  var defer = Q.defer();

  var options = {
      "hostname": symConfig.hostname,
      "port": symConfig.port,
      "path": "/sessionauth/v1/authenticate",
      "method": "POST",
      "key": fs.readFileSync(__dirname+symConfig.key),
      "cert": fs.readFileSync(__dirname+symConfig.cert),
      "passphrase": symConfig.passphrase
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;;
};

module.exports = SymBotAuth;
