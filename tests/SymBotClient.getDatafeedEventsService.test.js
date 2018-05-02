const SymConfigLoader = require('../lib/SymBotClient');

test('Execute DatafeedEventsService', () => {

  expect.assertions(1);

  const subscriberCallback = () => {
    console.log( 'subscriberCallback executed' );
  };

  return SymBotClient.getDatafeedEventsService( subscriberCallback ).then(data => {
    expect(data).toEqual({});
  });

}
