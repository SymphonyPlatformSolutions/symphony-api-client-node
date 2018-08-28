var SymBotAuth = require('../SymBotAuth')

var SymMessageParser = {}

const regex = /(<div.+?>)(.*)(<\/div>)/g
const regexTagStart = /<\w+>/g
const regexTagEnd = /<\/\w+>/g

SymMessageParser.parse = (messages) => {
  let arrMessages = JSON.parse(messages)
  var arrParsedMessages = []

  try {
    arrMessages.forEach(function (element) {
      if (element.type === 'MESSAGESENT' && element.initiator.user.userId !== SymBotAuth.botUser.id) {
        let m, newElement

        while ((m = regex.exec(element.payload.messageSent.message.message)) !== null) {
          if (m.index === regex.lastIndex) {
            regex.lastIndex++
          }
          newElement = element.payload.messageSent.message
          let textMessage = m[2].replace(regexTagStart, '')
          textMessage = textMessage.replace(regexTagEnd, '')
          newElement.messageText = textMessage
        }
        arrParsedMessages.push(newElement)
      }
    })
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing message', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed messages', arrParsedMessages)
  }

  return arrParsedMessages
}

module.exports = SymMessageParser
