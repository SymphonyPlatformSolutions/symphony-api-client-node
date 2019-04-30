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
class DatafeedEventsService extends EventEmitter {
  constructor() {
    super()

    // process exit handler
    this.onProcessExit = (event, exitCode = 0) => {
      this.stop(() => {
        console.log('Bot successfully shut down')
        process.exit(exitCode)
      })
      console.log('Waiting up to 30 seconds for data feed request to complete')
    }

    // process events to monitor
    this.exitEvents = [
      'SIGINT', // ctrl+c
      'SIGTERM', // docker container stopped
      'SIGUSR1', // nodemon restart
      'SIGUSR2',
      'uncaughtException',
    ]
  }

  start(feedId = null) {
    for (let event of ['message', 'error']) {
      if (!this.listenerCount(event)) {
        console.warn(`Datafeed has no "${event}" handler`)
      }
    }

    this.id = feedId
    this.liveStatus = true
    this.readErrors = 0

    if (this.id) {
      this._read()
    } else {
      this._create()
    }

    if (this.listenerCount('created') && process.env.NODE_ENV === 'production') {
      this.registerShutdownHooks()
    }
  }

  _create() {
    DatafeedClient.createDatafeed().then(
      ({ id }) => {
        this.id = id
        this.emit('created', id)
        this._read()
      },
      err => {
        this.emit('error', err)
      }
    )
  }

  _read() {
    DatafeedClient.getEventsFromDatafeed(this.id).then(
      response => {
        if (response.status === 'success') {
          this.emit('message', response.body)
        }

        if (this.liveStatus) {
          // continue reading from datafeed
          this._read()
        } else {
          this.emit('stopped')
          this.unregisterShutdownHooks()
        }

        this.readErrors = 0
      },
      err => {
        // invalid or expired feed id so retry up to 3 times
        if (err.statusCode === 400 && this.readErrors < 3) {
          this.id = null
          this.readErrors++
          this._create()
        } else {
          this.emit('error', err)
        }
      }
    )
  }

  stop(onStopped) {
    console.log(`The BOT ${SymBotAuth.botUser.displayName} is shutting down`)
    this.liveStatus = false
    if (onStopped) {
      this.once('stopped', onStopped)
    }
  }

  registerShutdownHooks() {
    for (let eventName of this.exitEvents) {
      process.on(eventName, this.onProcessExit)
    }
  }

  unregisterShutdownHooks() {
    for (let eventName of this.exitEvents) {
      process.off(eventName, this.onProcessExit)
    }
  }
}

module.exports = DatafeedEventsService
