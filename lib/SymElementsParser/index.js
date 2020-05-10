var SymBotAuth = require('../SymBotAuth')

var SymElementsParser = {}

SymElementsParser.parse = events => {
  const arrParsedMessages = []

  try {
    events.forEach(event => {
      if (event.type === 'SYMPHONYELEMENTSACTION' && event.initiator.user.userId !== SymBotAuth.botUser.id) {
        const action = event.payload.symphonyElementsAction
        const result = {
          id: event.id,
          messageId: event.messageId,
          timestamp: event.timestamp
        }
        result.initiator = event.initiator.user
        result.formId = action.formId
        result.formValues = action.formValues

        if (action.stream) {
          result.streamId = action.stream.streamId
          result.streamType = action.stream.streamType
        } else {
          result.streamId = action.formStream.streamId
            .replace(/=/g, '')
            .replace(/\//g, '_')
            .replace(/\+/g, '-')
        }
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
