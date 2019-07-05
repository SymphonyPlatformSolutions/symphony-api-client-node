const EventEmitter = require('events')
const DatafeedClient = require('../DatafeedClient')
const SymBotAuth = require('../SymBotAuth')
const SymMessageParser = require('../SymMessageParser')

/**
 * Datafeed service
 *
 * Usage:
 *   const feed = new Datafeed
 *   feed.on('message', messageHandler)   // receives array of parsed messages each time they are received
 *   feed.on('error',   errorHandler)     // receives error when the feed has an unrecoverable error
 *   feed.on('created', saveHandler)      // receives the feed ID each time a new one is created
 *   feed.on('stopping', stopHandler)     // triggered when the datafeed starts stopping
 *   feed.on('stopped', stopHandler)      // triggered once the datafeed has stopped cleanly
 *   feed.on('shutdown', shutdownHandler) // triggered after stopped when the stop was caused by a shutdown hook.
 *                                        // if no event handler was registered here process.exit will be called.
 *   feed.start()                         // create a datafeed and start reading
 *   feed.start(id)                       // or, continue reading existing feed
 *   ...
 *   feed.stop()                          // stop datafeed once current request completes or times out
 *
 * Shutdown hooks:
 *
 * This registers shutdown hooks in order to stop the datafeed cleanly and to avoid message loss.
 * Shutdown hooks are only registered when the NODE_ENV is 'production' and the user has attached a 'created'
 * event handler that is used to save the datafeed id.
 * The shutdown hook will call process.exit after the last call from the feed has been completed unless a 'shutdown'
 * event handler has been registered. In this case it is expected that the caller handle the exit process however they wish to.
 */
class DatafeedEventsService extends EventEmitter {
  constructor() {
    super()

    // process exit handler
    this.onProcessExit = (event, exitCode = 0) => {
      this.stop(() => {
        console.log('Bot successfully shut down')
        this.emit('shutdown', event, exitCode)
        if (!this.listenerCount('shutdown')) {
          process.exit(exitCode)
        }
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
          const eventsByType = response.body.reduce((acc, event) => {
            const type = event.type.toLowerCase()
            if (!acc[type]) {
              acc[type] = []
            }
            acc[type].push(event)
            return acc
          }, {})

          Object.entries(eventsByType).forEach(([type, events]) => {
            if (type === 'messagesent') {
              const messages = SymMessageParser.parse(events)
              this.emit('messagesent', messages)
              // for back compat
              this.emit('message', messages)
            } else {
              this.emit(type, events)
            }
          })
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
    this.emit('stopping')
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
