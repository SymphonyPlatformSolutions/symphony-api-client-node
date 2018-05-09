var SymBotAuth = require('../SymBotAuth');

var SymMessageParser = {};

const regex = /(\<div.+?\>)(.*)(\<\/div\>)/g;
const regex_tag_start = /<\w+>/g;
const regex_tag_end = /<\/\w+>/g;

SymMessageParser.parse = (messages) => {
  let arr_messages = JSON.parse(messages);
  var arr_parsed_messages = [];

  try {

    arr_messages.forEach(function(element) {
      if (element.type=="MESSAGESENT" && element.initiator.user.userId != SymBotAuth.botUser.id) {
        let m, new_element;

        while ((m = regex.exec(element.payload.messageSent.message.message)) !== null) {

            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            new_element = element.payload.messageSent.message;
            let text_message = m[2].replace(regex_tag_start, '');
            text_message = text_message.replace(regex_tag_end, '');
            new_element.messageText = text_message;
        }
        arr_parsed_messages.push( new_element );
      }
    });

  } catch (e) {
    if (SymBotAuth.debug) {
      console.log( '[DEBUG]', 'error parsing message', e);
    }
  }

  if (SymBotAuth.debug) {
    console.log( '[DEBUG]', 'parsed messages', arr_parsed_messages);
  }

  return arr_parsed_messages;
}

module.exports = SymMessageParser;
