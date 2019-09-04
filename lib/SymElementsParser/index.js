var SymBotAuth = require('../SymBotAuth')

var SymElementsParser = {}

SymElementsParser.parse = events => {
  const arrParsedMessages = []

  try {
    events.forEach(event => {
      const result = {}

      if (event.type === 'SYMPHONYELEMENTSACTION' && event.initiator.user.userId !== SymBotAuth.botUser.id) {
        result.id = event.id
        result.messageId = event.messageId
        result.timestamp = event.timestamp
        result.initiator = event.initiator.user
        result.payload = event.payload.symphonyElementsAction
        arrParsedMessages.push(result)
        console.log('** Console:', result)
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

// function adaptResponseModel(data) {
//   if data.payload.symphonyElementsAction.formStream.streamId  yourNewProperty: oldProperty,
//       return {
//     add others here
//       }
//     }

module.exports = SymElementsParser
