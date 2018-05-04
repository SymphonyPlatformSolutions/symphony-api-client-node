var SymBotAuth = require('../SymBotAuth');
var SymBotClient = require('../SymBotClient');

var SymMessageParser = {};

const regex = /(\<div.+?\>)(.*)(\<\/div\>)/g;

SymMessageParser.parse = (messages) => {
  let arr_messages = JSON.parse(messages);
  var arr_parsed_messages = [];

  arr_messages.forEach(function(element) {
    if (element.type=="MESSAGESENT" && element.initiator.user.userId != SymBotAuth.botUser.id) {
      let m, new_element;

      while ((m = regex.exec(element.payload.messageSent.message.message)) !== null) {

          if (m.index === regex.lastIndex) {
              regex.lastIndex++;
          }
          new_element = element.payload.messageSent.message;
          new_element.messageText = m[2];
      }
      arr_parsed_messages.push( new_element );
    }
  });

  if (SymBotClient.debug) {
    console.log( '[DEBUG]', 'parsed messages', arr_parsed_messages);
  }

  return arr_parsed_messages;
}

module.exports = SymMessageParser;
