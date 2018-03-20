const SymConfigLoader = require('../lib/SymConfigLoader');

test('Load config from file', () => {
  expect.assertions(1);
  return SymConfigLoader.loadFromFile('/../../config.json').then(data => {
    expect(data).toEqual({
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
    });
  });
});
