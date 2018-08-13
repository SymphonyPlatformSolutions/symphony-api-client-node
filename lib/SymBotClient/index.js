const SymBotAuth = require('../SymBotAuth');
const SymConfigLoader = require('../SymConfigLoader');
const DatafeedEventsService = require('../DatafeedEventsService');
const MessagesClient = require('../MessagesClient');
const UsersClient = require('../UsersClient');
const PresenceClient = require('../PresenceClient');
const Q = require('kew');

var SymBotClient = {};

SymBotClient.PRESENTATIONML_FORMAT = MessagesClient.PRESENTATIONML_FORMAT;
SymBotClient.MESSAGEML_FORMAT = MessagesClient.MESSAGEML_FORMAT;

SymBotClient.sessionToken = {};

SymBotClient.initBot = (path_to_config_file) => {
  var defer = Q.defer();

  SymConfigLoader.loadFromFile(path_to_config_file).then( SymConfig => {
    SymBotAuth.authenticate( SymConfig ).then( (symAuth) => {
      defer.resolve( { 'config': SymConfig, 'sessionAuthToken': symAuth.sessionAuthToken, 'kmAuthToken': symAuth.kmAuthToken } );
    })
  }).fail( (err) => {
    defer.reject( err );
  });

  return defer.promise;
}

/* DatafeedClient Services */

SymBotClient.getDatafeedEventsService = (subscriberCallback) => {
  DatafeedEventsService.initService(subscriberCallback);
}

SymBotClient.stopDatafeedEventsService = () => {
  DatafeedEventsService.stopService();
}

/* MessagesClient Services */

SymBotClient.sendMessage = ( conversationId, message, data, format ) => {
  var defer = Q.defer();

  MessagesClient.sendMessage( conversationId, message, data, format ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.forwardMessage = ( conversationId, message, data ) => {
  var defer = Q.defer();

  MessagesClient.forwardMessage( conversationId, message, data ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.getAttachment = ( streamId, attachmentId, messageId ) => {
  var defer = Q.defer();

  MessagesClient.getAttachment( streamId, attachmentId, messageId ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

/* UsersClient Services */

SymBotClient.getUserFromUsername = ( username ) => {
  var defer = Q.defer();

  UsersClient.getUserFromUsername( username ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.getUserFromEmail = ( email, local ) => {
  var defer = Q.defer();

  UsersClient.getUserFromEmail( email, local ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.getUsersFromEmailList = ( emailList, local ) => {
  var defer = Q.defer();

  UsersClient.getUsersFromEmailList( emailList, local ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.getUsersFromIdList = ( idList, local ) => {
  var defer = Q.defer();

  UsersClient.getUsersFromIdList( idList, local ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.searchUsers = ( query, local, skip, limit, filter ) => {
  var defer = Q.defer();

  UsersClient.searchUsers( query, local, skip, limit, filter ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

/* Presence Services */

SymBotClient.getUserPresence = ( userId, local ) => {
  var defer = Q.defer();

  PresenceClient.getUserPresence( userId, local ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.setPresence = ( status ) => {
  var defer = Q.defer();

  PresenceClient.setPresence( status ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

SymBotClient.registerInterestExtUser = ( idList ) => {
  var defer = Q.defer();

  PresenceClient.registerInterestExtUser( idList ).then( (res) => {
    defer.resolve(res);
  });

  return defer.promise;
}

/* Other Services */

SymBotClient.setDebugMode = (mode) => {
  SymBotAuth.debug = mode;
  if (SymBotAuth.debug) {
    console.log('[DEBUG] Debug mode turned on');
  } else {
    console.log('[DEBUG] Debug mode turned off');
  }
};

module.exports = SymBotClient;
