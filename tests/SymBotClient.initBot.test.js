const SymConfigLoader = require('../lib/SymBotClient');

test('Initialize Bot', () => {

  expect.assertions(1);

  return SymBotClient.initBot( __dirname + '/config.json' ).then(data => {
    expect(data).toEqual({});
  });

}
