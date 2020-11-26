const SymMessageParser = require('../../lib/SymMessageParser');

describe('Message parsing', () => {
  beforeAll(() => {
    const SymBotAuth = require('../../lib/SymBotAuth')
    SymBotAuth.botUser = { id: -1};
  });

  test('invalid opening tag', () => {
    assertMessageParsed('<divsa data-format="PresentationML" data-version="2.0">Hello, World</div>',
      'Hello, World');
  });

  test('no opening tag', () => {
    assertMessageParsed(' data-format="PresentationML" data-version="2.0">Hello, World</>',
      undefined);
  });

  test('no closing tag', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0">Hello, World',
      undefined);
  });

  test('simple message', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0">Hello, World</div>',
      'Hello, World');
  });

  test('simple message with spaces around div', () => {
    assertMessageParsed('   <div data-format="PresentationML" data-version="2.0">Hello, World</div>   ',
      'Hello, World');
  });

  test('message enclosed in markups', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0"><b>Hello, World</b></div>',
      'Hello, World');
  });

  test('message enclosed in markups with spaces around div', () => {
    assertMessageParsed('  <div data-format="PresentationML" data-version="2.0"><b>Hello, World</b></div>  ',
      'Hello, World');
  });

  test('message partially enclosed in markups', () => {
    assertMessageParsed('<div data-format="PresentationML" data-version="2.0">Hello <b>wonderful</b> world</div>',
      'Hello wonderful world');
  });

  test('message partially enclosed in markups with spaces around div', () => {
    assertMessageParsed('  <div data-format="PresentationML" data-version="2.0">Hello <b>wonderful</b> world</div>  ',
      'Hello wonderful world');
  });

  test('message with several levels of markups', () => {
    assertMessageParsed(
      '<div data-format="PresentationML" data-version="2.0">Hello <b>wonderful <c>and</c> beautiful</b> world</div>',
      'Hello wonderful and beautiful world');
  });

  test('message with several levels of markups with spaces around div', () => {
    assertMessageParsed(
      '   <div data-format="PresentationML" data-version="2.0">Hello <b>wonderful <c>and</c> beautiful</b> world</div>  ',
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
