const FirehoseClient = require('../FirehoseClient')
const SymBotAuth = require('../SymBotAuth')
const PubSub = require('pubsub-js')

var FirehoseEventsService = {
  liveStatus: true
}

FirehoseEventsService.initService = (subscriberCallback) => {
  var psToken = PubSub.subscribe('FIREHOSE: MESSAGE_RECEIVED', subscriberCallback)
  FirehoseClient.registerBot(psToken)

  FirehoseEventsService.startFirehose()
}

FirehoseEventsService.startFirehose = () => {
  FirehoseClient.createFirehose().then((firehoseInstance) => {
    FirehoseEventsService.readFirehose(firehoseInstance.id)
  })
}

FirehoseEventsService.stopService = () => {
  console.log('FIREHOSE: The BOT ' + SymBotAuth.botUser.displayName + ' will be automatically stopped in the next 30 sec...')
  FirehoseEventsService.liveStatus = false
}

FirehoseEventsService.readFirehose = (firehoseId) => {
  if (FirehoseEventsService.liveStatus) {
    FirehoseClient.getEventsFromFirehose(firehoseId).then((res) => {
      if (res.status === 'success') {
        FirehoseEventsService.readFirehose(firehoseId)
      } else if (res.status === 'timeout') {
        FirehoseEventsService.readFirehose(firehoseId)
      }
    })
  }
}

module.exports = FirehoseEventsService
