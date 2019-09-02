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

SymMessageParser.getCashtags = (message) => {
  const arrCashTags = []

  try {
    const parsedData = JSON.parse(message.data)
    const cashTags = Object.values(parsedData)

    for (const cashTag of cashTags) {
      for (const dataId of cashTag.id) {
        if (dataId.type === CASHTAG_TYPE) {
          arrCashTags.push(dataId.value)
        }
      }
    }
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing cashTags', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed cashTags', arrCashTags)
  }

  return arrCashTags
}

SymMessageParser.getHashtags = (message) => {
  const arrHashTags = []

  try {
    const parsedData = JSON.parse(message.data)
    const hashTags = Object.values(parsedData)

    for (const hashTag of hashTags) {
      for (const dataId of hashTag.id) {
        if (dataId.type === HASHTAG_TYPE) {
          arrHashTags.push(dataId.value)
        }
      }
    }
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing hashTags', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed hashTags', arrHashTags)
  }

  return arrHashTags
}

SymMessageParser.getMentions = (message) => {
  const arrMentions = []

  try {
    const parsedData = JSON.parse(message.data)
    const mentions = Object.values(parsedData)

    for (const mention of mentions) {
      for (const dataId of mention.id) {
        if (dataId.type === MENTION_TYPE) {
          arrMentions.push(dataId.value)
        }
      }
    }
  } catch (e) {
    if (SymBotAuth.debug) {
      console.log('[DEBUG]', 'error parsing @ mentions', e)
    }
  }

  if (SymBotAuth.debug) {
    console.log('[DEBUG]', 'parsed @ mentions', arrMentions)
  }

  return arrMentions
}

module.exports = SymMessageParser
