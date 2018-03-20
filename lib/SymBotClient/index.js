const SymBotAuth = require('SymBotAuth');
const SymConfigLoader = require('SymConfigLoader');
const DatafeedEventsService = require('DatafeedEventsService');
const Q = require('kew');

var SymBotClient = {};

SymBotClient.sessionToken = {};

SymBotClient.initBot = (path_to_config_file) => {
  var defer = Q.defer();

  SymConfigLoader.loadFromFile(path_to_config_file).then( SymConfig => {
    SymBotAuth.authenticate( SymConfig ).then( SymSessionToken => {
      SymBotClient.sessionToken = SymSessionToken;
    })
  });

  return defer.promise();
}

SymBotClient.getDatafeedEventsService = () => {
  DatafeedEventsService.initService( SymBotClient.sessionToken );
}

module.exports = SymBotClient;
