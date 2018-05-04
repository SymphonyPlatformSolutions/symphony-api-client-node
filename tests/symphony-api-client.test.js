const SymBotClient = require('../lib/SymBotClient');

var testContext = {};

jest.setTimeout(15000);

beforeAll(() => {
  return SymBotClient.initBot( __dirname + '/../config.json' ).then(data => {
    testContext.symAuth = data;
  })
});

afterAll(() => {
  SymBotClient.stopDatafeedEventsService();
});

test('Retrieve sessionAuthToken', () => {
  expect(testContext.symAuth.sessionAuthToken).toBeDefined();
});

test('Retrieve kmAuthToken', () => {
  expect(testContext.symAuth.kmAuthToken).toBeDefined();
});

test('Execute getDatafeedEventsService', (done) => {

  const botHearsRequest = ( event, messages ) => {
    expect(messages[0].stream).toBeDefined();
    testContext.streamId = messages[0].stream.streamId;
    done();
  };

  SymBotClient.getDatafeedEventsService( botHearsRequest );
});

test('Execute sendMessage', () => {
  expect.assertions(1);
  return SymBotClient.sendMessage( testContext.streamId, 'Test sendMessage', null, SymBotClient.MESSAGEML_FORMAT ).then( (data) => {
    expect(data.messageId).toBeDefined();
  });
});
