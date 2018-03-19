const SymConfigLoader = require('../lib/SymConfigLoader');

test('Load config from file', () => {
  expect.assertions(1);
  return SymConfigLoader.loadFromFile('/../../config.json').then(data => {
    expect(data).toEqual({
        "hostname": "sup-api.symphony.com",
        "port": 443,
        "path": "/sessionauth/v1/authenticate",
        "method": "POST",
        "key": "/certificates/bot.user1.pem",
        "cert": "/certificates/bot.user1.pem",
        "passphrase": "changeit"
    });
  });
});
