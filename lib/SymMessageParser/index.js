var SymBotAuth = require('../SymBotAuth')

var SymMessageParser = {}

const regex = /(<div.+?>)(.*)(<\/div>)/g
const regexTagStart = /<\w+>/g
const regexTagEnd = /<\/\w+>/g

const HASHTAG_TYPE = 'org.symphonyoss.taxonomy.hashtag'
const CASHTAG_TYPE = 'org.symphonyoss.fin.security.id.ticker'
const MENTION_TYPE = 'com.symphony.user.userId'
const EntityRegex = 'id=\"\\d+\">(.*?)<'

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

function getTags (message, type) {
  const arrTags = []

  try {
    const parsedData = JSON.parse(message.data)
    const tags = Object.values(parsedData)

    for (const tag of tags) {
      for (const dataId of tag.id) {
        if (dataId.type === type) {
          arrTags.push(dataId.value)
        }
      }
    }
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing tags [' + type + ']', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed tags [' + type + ']', arrTags)
  }

  return arrTags
}

SymMessageParser.getCashtags = (message) => {
  return getTags(message, CASHTAG_TYPE)
}

SymMessageParser.getHashtags = (message) => {
  return getTags(message, HASHTAG_TYPE)
}

SymMessageParser.getMentions = (message) => {
  return getTags(message, MENTION_TYPE)
}

module.exports = SymMessageParser
