const https = require('https');
const FormData = require('form-data');
const Q = require('kew');
const PubSub = require('pubsub-js');
const SymConfigLoader = require('../SymConfigLoader');
const SymBotAuth = require('../SymBotAuth');

var MessagesClient = {};

MessagesClient.PRESENTATIONML_FORMAT = 'presentationML';
MessagesClient.MESSAGEML_FORMAT = 'messageML';

MessagesClient.sendMessage = (conversationId, message, data, format) => {
  if (format == MessagesClient.PRESENTATIONML_FORMAT) {
    message = "<div data-format=\"PresentationML\" data-version=\"2.0\">" + message + "</div>";
    return send(conversationId, message, data);
  } else if (format == MessagesClient.MESSAGEML_FORMAT) { 
    message = "<messageML>" + message + "</messageML>";
    return send(conversationId, message, data);
  }
}

MessagesClient.forwardMessage = (conversationId, message, data) => {
  return send(conversationId, message, data);
}

var send = (conversationId, message, data) => {
  var defer = Q.defer();

  var form = new FormData();
  form.append('message', message);
  if (data != null) { 
    form.append('data', data);
  }

  var headers = form.getHeaders();
  headers.sessionToken = SymBotAuth.sessionAuthToken;
  headers.keyManagerToken = SymBotAuth.kmAuthToken;

  var options = {
      "hostname": SymConfigLoader.SymConfig.agentHost,
      "port": SymConfigLoader.SymConfig.agentPort,
      "path": '/agent/v4/stream/' + conversationId + '/message/create',
      "method": "POST",
      "headers": headers
  };

  var req = https.request(options);

  form.pipe(req);

  req.on('response', function(res) {
    var str = '';
    res.on('data', function(chunk) {
        str += chunk;
    });
    res.on('end', function() {
        defer.resolve(JSON.parse(str));
    });
  });

  req.on('error', function (e) {
    defer.reject( {"status": "error"} );
  });

  return defer.promise;
}

module.exports = MessagesClient;
