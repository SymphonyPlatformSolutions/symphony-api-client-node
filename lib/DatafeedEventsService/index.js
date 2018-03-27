const DatafeedClient = require('../DatafeedClient');
const PubSub = require('pubsub-js');
const Q = require('kew');

var DatafeedEventsService = {};

DatafeedEventsService.initService = (subscriberCallback) => {

  var psToken = PubSub.subscribe( "MESSAGE_RECEIVED", subscriberCallback );
  DatafeedClient.registerBot( psToken );

  DatafeedEventsService.startDatafeed();
}

DatafeedEventsService.startDatafeed = () => {

  DatafeedClient.createDatafeed().then( (datafeedInstance) => {
    DatafeedEventsService.readDatafeed( datafeedInstance.id );
  });

}

DatafeedEventsService.readDatafeed = (datafeedId) => {

  DatafeedClient.getEventsFromDatafeed(datafeedId).then( (res) => {
    if (res.status=='success') {
      DatafeedEventsService.readDatafeed(datafeedId);
    } else if (res.status=='timeout') {
      DatafeedEventsService.readDatafeed(datafeedId);
    }
  });

}

module.exports = DatafeedEventsService;
