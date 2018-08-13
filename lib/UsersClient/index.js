const https = require('https');
const Q = require('kew');
const SymConfigLoader = require('../SymConfigLoader');
const SymBotAuth = require('../SymBotAuth');

var UsersClient = {};

UsersClient.getUserFromUsername = (username) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v2/user?username=" + username,
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
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'UsersClient/getUserFromUsername/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

UsersClient.getUserFromEmail = (email, local) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v2/user?username=" + username,
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
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'UsersClient/getUserFromEmail/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

UsersClient.getUsersFromEmailList = (emailList, local) => {
  return UsersClient.getUserV3(emailList, '', local);
}

UsersClient.getUsersFromIdList = (idList, local) => {
  return UsersClient.getUserV3('', idList, local);
}

UsersClient.getUserV3 = (emailList, idList, local) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v3/users?emailList=" + emailList + '&idList=' + idList,
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
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'UsersClient/getUserV3/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

UsersClient.searchUsers = (query, local, skip, limit, filter) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/user/search?local=" + local + '&skip=' + skip + '&limit=' + limit,
      "method": "POST",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken
      },
  };

  var body = {
    "query": query,
    "filter": filter
  }

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'UsersClient/searchUsers/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.write(body);
  req.end();

  return defer.promise;
}


module.exports = UsersClient;
