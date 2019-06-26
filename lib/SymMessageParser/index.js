var SymBotAuth = require('../SymBotAuth')

var SymMessageParser = {}

const regex = /(<div.+?>)(.*)(<\/div>)/g
const regexTagStart = /<\w+>/g
const regexTagEnd = /<\/\w+>/g

SymMessageParser.parse = events => {
  const arrParsedMessages = []

  try {
    events.forEach(event => {
      if (event.type === 'MESSAGESENT' && event.initiator.user.userId !== SymBotAuth.botUser.id) {
        let match
        const message = event.payload.messageSent.message

        while ((match = regex.exec(message.message)) !== null) {
          if (match.index === regex.lastIndex) {
            regex.lastIndex++
          }
          let textMessage = match[2].replace(regexTagStart, '')
          textMessage = textMessage.replace(regexTagEnd, '')
          message.messageText = textMessage
        }
        arrParsedMessages.push(message)
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
