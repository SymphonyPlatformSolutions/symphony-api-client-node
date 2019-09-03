var SymBotAuth = require('../SymBotAuth')

var SymElementsParser = {}

SymElementsParser.parse = events => {
  const arrParsedMessages = []

  try {
    events.forEach(event => {
      const result = {}

      if (event.type === 'SYMPHONYELEMENTSACTION' && event.initiator.user.userId !== SymBotAuth.botUser.id) {
        result.user = event.initiator.user
        result.actions = event.payload.symphonyElementsAction
        arrParsedMessages.push(result)
      }
    })
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing elements', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed elements', arrParsedMessages)
  }

  return arrParsedMessages
}

module.exports = SymElementsParser
