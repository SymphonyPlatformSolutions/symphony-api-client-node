const SymMessageParser = require('../../lib/SymMessageParser');

describe('Message parsing', () => {
  beforeAll(() => {
    const SymBotAuth = require('../../lib/SymBotAuth')
    SymBotAuth.botUser = { id: -1};
  });

  test('simple message parsing', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0">Hello, World</div>',
      'Hello, World');
  });

  test('complex message parsing', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0"><b>Hello, World</b></div>',
      'Hello, World');
  });

  test('complex message parsing', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0">Hello <b>wonderful</b> world</div>',
      'Hello wonderful world');
  });

  test('complex message parsing', () => {
    assertMessageParsed(
      '<div data-format="PresentationML" data-version="2.0">Hello <b>wonderful <c>and</c> beautiful</b> world</div>',
      'Hello wonderful and beautiful world');
  });
});

function assertMessageParsed(incomingMessage, expectedParsedMessage) {
  const event = {
    type: 'MESSAGESENT',
    initiator: {user: {id: 1234}},
    payload: {messageSent: {message: {message: incomingMessage}}}
  };

  let parsedMessages = SymMessageParser.parse([event]);

  expect(Array.isArray(parsedMessages)).toBeTruthy();
  expect(parsedMessages.length).toBe(1);

  expect(parsedMessages[0].messageText).toBe(expectedParsedMessage);
}
