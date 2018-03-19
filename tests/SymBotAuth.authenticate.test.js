const SymConfigLoader = require('../lib/SymConfigLoader');
const SymBotAuth = require('../lib/SymBotAuth');
const fs = require('fs');

test('Authenticates the Bot app', () => {

  expect.assertions(1);

  return SymBotAuth.authenticate(
    {
        "hostname": "sup-api.symphony.com",
        "port": 443,
        "path": "/sessionauth/v1/authenticate",
        "method": "POST",
        "key": "/../../certificates/bot.user1.pem",
        "cert": "/../../certificates/bot.user1.pem",
        "passphrase": "changeit"
    }
  ).then(data => {

    var desiredData = {
      "name": "sessionToken"
    }
    expect(data).toMatchObject(desiredData);
  });

});
