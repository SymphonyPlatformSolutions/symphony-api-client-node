const EventEmitter = require('events')
const DatafeedClient = require('../DatafeedClient')
const SymBotAuth = require('../SymBotAuth')

/**
 * Datafeed service
 *
 * Usage:
 *   const feed = new Datafeed
 *   feed.on('message', messageHandler) // receives array of parsed messages each time they are received
 *   feed.on('error',   errorHandler)   // receives error when the feed has an unrecoverable error
 *   feed.on('created', saveHandler)    // receives the feed ID each time a new one is created
 *   feed.on('stopped', stopHandler)    // triggered once the datafeed has stopped cleanly
 *   feed.start()                       // create a datafeed and start reading
 *   feed.start(id)                     // or, continue reading existing feed
 *   ...
 *   feed.stop()                        // stop datafeed once current request completes or times out
 */
class Datafeed extends EventEmitter {
  start(feedId = null) {
    for (let event of ['message', 'error']) {
      if (!this.listenerCount(event)) {
        console.warn(`Datafeed has no "${event}" handler`)
      }
    }

    this.id = feedId
    this.liveStatus = true

    if (this.id) {
      this._read()
    } else {
      this._create()
    }
  }

  _create() {
    return DatafeedClient.createDatafeed().then(
      ({ id }) => {
        this.id = id
        this.emit('created', id)
        return this._read()
      },
      err => {
        this.emit('error', err)
      }
    )
  }

  _read() {
    return DatafeedClient.getEventsFromDatafeed(this.id).then(
      response => {
        if (response.status === 'success') {
          this.emit('message', response.body)
        }

        if (this.liveStatus) {
          this._read()
        } else {
          this.emit('stopped')
        }
      },
      err => {
        if (err.statusCode === 400) {
          // invalid or expired feed id
          this.id = null
          return this._create()
        } else {
          this.emit('error', err)
        }
      }
    )
  }

  stop(onStopped) {
    console.log(
      'The BOT ' +
        SymBotAuth.botUser.displayName +
        ' will be automatically stopped in the next 30 sec...'
    )
    this.liveStatus = false
    if (onStopped) {
      this.on('stopped', onStopped)
    }
  }
}

module.exports = Datafeed
