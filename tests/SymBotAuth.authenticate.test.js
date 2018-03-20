const SymConfigLoader = require('../lib/SymConfigLoader');
const SymBotAuth = require('../lib/SymBotAuth');
const fs = require('fs');

test('Authenticates the Bot app', () => {

  expect.assertions(1);

  return SymBotAuth.authenticate(
    {
        "sessionAuthHost": "sup-api.symphony.com",
        "sessionAuthPort": 443,
        "keyAuthHost": "sup-keyauth.symphony.com",
        "keyAuthPort": 443,
        "podHost": "sup.symphony.com",
        "podPort": 443,
        "agentHost": "sup-agent.symphony.com",
        "agentPort": 443,
        "botCertPath": "/../../certificates/",
        "botCertName": "bot.user1.pem",
        "botCertPassword": "changeit",
        "botEmailAddress": "",
        "appCertPath": "",
        "appCertName": "",
        "appCertPassword": "",
        "proxyURL": "",
        "proxyUsername": "",
        "proxyPassword": "",
        "authTokenRefreshPeriod": "30"
    }
  ).then(data => {

    var desiredData = {
      "name": "sessionToken"
    }
    expect(data).toMatchObject(desiredData);
  });

});
