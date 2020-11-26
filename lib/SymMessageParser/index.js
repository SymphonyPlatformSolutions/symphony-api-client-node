var SymBotAuth = require('../SymBotAuth')

var SymMessageParser = {}

const regex = /^\s*(<div.+?>)(.*)(<\/div>)\s*$/g
const regexTagStart = /<\w+>/g
const regexTagEnd = /<\/\w+>/g

const HASHTAG_TYPE = 'org.symphonyoss.taxonomy.hashtag'
const CASHTAG_TYPE = 'org.symphonyoss.fin.security.id.ticker'
const MENTION_TYPE = 'com.symphony.user.userId'

SymMessageParser.parse = events => {
  const arrParsedMessages = []

  try {
    events.forEach(event => {
      if (event.type === 'MESSAGESENT' && event.initiator.user.userId !== SymBotAuth.botUser.id) {
        const message = event.payload.messageSent.message

        message.messageText = extractTextFromPresentationML(message.message)

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

function extractTextFromPresentationML(presentationMl) {
  const trimmedPresentationMl = presentationMl.trim()

  let indexOfFirstDivTag = trimmedPresentationMl.indexOf('<div')
  if (indexOfFirstDivTag == -1) {
    return undefined;
  }

  let firstIndex = trimmedPresentationMl.indexOf('>', indexOfFirstDivTag) // index of first <div> tag

  let lastIndex = trimmedPresentationMl.lastIndexOf('</div>') // index of last </div> tag
  if(lastIndex == -1) {
    return undefined
  }

  let insideDiv = trimmedPresentationMl.substring(firstIndex + 1, lastIndex) // extract what is inside <div></div>
  return insideDiv.replace(regexTagStart, '').replace(regexTagEnd, '') //remove inside tags and extract text
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
