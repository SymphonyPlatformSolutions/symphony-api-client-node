const fs = require('fs');
const https = require('https');
const Q = require('kew');
const SymConfigLoader = require('../SymConfigLoader');

var SymBotAuth = {};

SymBotAuth.sessionAuthenticate = (symConfig) => {

  var defer = Q.defer();

  var options = {
      "hostname": symConfig.sessionAuthHost,
      "port": symConfig.sessionAuthPort,
      "path": "/sessionauth/v1/authenticate",
      "method": "POST",
      "key": fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      "cert": fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      "passphrase": symConfig.botCertPassword
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          var SymSessionToken = JSON.parse(str);
          SymBotAuth.sessionAuthToken = SymSessionToken.token;
          defer.resolve(SymSessionToken.token);
      });
  });

  req.end();

  return defer.promise;
};

SymBotAuth.kmAuthenticate = (symConfig) => {

  var defer = Q.defer();

  var options = {
      "hostname": symConfig.keyAuthHost,
      "port": symConfig.keyAuthPort,
      "path": "/keyauth/v1/authenticate",
      "method": "POST",
      "key": fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      "cert": fs.readFileSync(symConfig.botCertPath + symConfig.botCertName, 'utf8'),
      "passphrase": symConfig.botCertPassword
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          var SymKmToken = JSON.parse(str);
          SymBotAuth.kmAuthToken = SymKmToken.token;
          defer.resolve(SymKmToken.token);
      });
  });

  req.end();

  return defer.promise;
};

SymBotAuth.initBotUser = (symConfig) => {

  var defer = Q.defer();

  var options = {
      "hostname": symConfig.podHost,
      "port": symConfig.podPort,
      "path": "/pod/v3/users?email=" + symConfig.botEmailAddress,
      "method": "GET",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken
      },
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          var results = JSON.parse(str);
          if (results.users.length > 0) {
            SymBotAuth.botUser = results.users[0];
            console.log( '--- Symphony Client initialization ---');
            console.log( 'The BOT ' + SymBotAuth.botUser.displayName + ' is ready to serve :-)');
            defer.resolve(results.users[0]);
          } else {
            defer.resolve({});
          }
      });
  });

  req.end();

  return defer.promise;
};

SymBotAuth.authenticate = (symConfig) => {

  var defer = Q.defer();

  SymBotAuth.sessionAuthenticate(symConfig)
    .then( (SymSessionToken) => {
      SymBotAuth.kmAuthenticate(symConfig)
        .then( (SymKmToken) => {
          SymBotAuth.initBotUser(symConfig)
          defer.resolve( { 'sessionAuthToken': SymSessionToken, 'kmAuthToken': SymKmToken } );
        })
        .fail( (err) => {
          console.log('err authenticate', err);
        })
    })

  return defer.promise;
};

module.exports = SymBotAuth;
