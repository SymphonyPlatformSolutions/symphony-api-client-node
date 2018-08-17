const DatafeedClient = require('../DatafeedClient')
const SymBotAuth = require('../SymBotAuth')
const PubSub = require('pubsub-js')

var DatafeedEventsService = {
  liveStatus: true
}

DatafeedEventsService.initService = (subscriberCallback) => {
  var psToken = PubSub.subscribe('MESSAGE_RECEIVED', subscriberCallback)
  DatafeedClient.registerBot(psToken)

  DatafeedEventsService.startDatafeed()
}

DatafeedEventsService.startDatafeed = () => {
  DatafeedClient.createDatafeed().then((datafeedInstance) => {
    DatafeedEventsService.readDatafeed(datafeedInstance.id)
  })
}

DatafeedEventsService.stopService = () => {
  console.log('The BOT ' + SymBotAuth.botUser.displayName + ' will be automatically stopped in the next 30 sec...')
  DatafeedEventsService.liveStatus = false
}

DatafeedEventsService.readDatafeed = (datafeedId) => {
  if (DatafeedEventsService.liveStatus) {
    DatafeedClient.getEventsFromDatafeed(datafeedId).then((res) => {
      if (res.status === 'success') {
        DatafeedEventsService.readDatafeed(datafeedId)
      } else if (res.status === 'timeout') {
        DatafeedEventsService.readDatafeed(datafeedId)
      }
    })
  }
}

module.exports = DatafeedEventsService
