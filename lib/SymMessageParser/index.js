var SymBotAuth = require('../SymBotAuth');

var SymMessageParser = {};

const regex = /(\<div.*\>)(.*)(\<\/div\>)/g;

SymMessageParser.parse = (messages) => {
  let arr_messages = JSON.parse(messages);
  var arr_parsed_messages = [];

  arr_messages.forEach(function(element) {
    if (element.type=="MESSAGESENT" && element.initiator.user.userId != SymBotAuth.botUser.id) {
      let m;

      while ((m = regex.exec(element.payload.messageSent.message.message)) !== null) {

          if (m.index === regex.lastIndex) {
              regex.lastIndex++;
          }

          element.messageText = m[2];
      }
      arr_parsed_messages.push( element );
    }
  });

  return arr_parsed_messages;
}

module.exports = SymMessageParser;
