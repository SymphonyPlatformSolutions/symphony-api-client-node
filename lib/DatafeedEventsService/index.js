const EventEmitter = require('events')
const DatafeedClient = require('../DatafeedClient')
const SymBotAuth = require('../SymBotAuth')
const SymConfigLoader = require('../SymConfigLoader')
const SymMessageParser = require('../SymMessageParser')
const SymElementsParser = require('../SymElementsParser')
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

    this.processExitTriggered = false

    // process exit handler
    this.onProcessExit = (event, exitCode = 0) => {
      if (!this.processExitTriggered) {
        this.processExitTriggered = true
        this.stop(() => {
          console.log('Bot successfully shut down')
          this.emit('shutdown', event, exitCode)
          if (!this.listenerCount('shutdown')) {
            process.exit(exitCode)
          }
        })
        console.log('Waiting up to 30 seconds for data feed request to complete')
      }
    }

    // process events to monitor
    this.exitEvents = [
      'SIGINT', // ctrl+c
      'SIGTERM', // docker container stopped
      'SIGUSR1', // nodemon restart
      'SIGUSR2',
      'uncaughtException'
    ]

    // retry connection constants
    // default 64 seconds as in Google Cloud Storage
    this.MAX_WAIT_INTERVAL = SymConfigLoader.SymConfig.maxWaitInterval ? SymConfigLoader.SymConfig.maxWaitInterval * 1000 : 64000
    this.MAX_RETRIES = SymConfigLoader.SymConfig.maxRetries || 100
  }

  start(feedId = null) {
    for (let event of ['message', 'error']) {
      if (!this.listenerCount(event)) {
        console.warn(`Datafeed has no "${event}" handler`)
      }
    }

    feedId = this._fixFeedId(feedId)

    this.id = feedId
    this.liveStatus = true
    this.retries = 0

    if (this.id) {
      console.log('Attached to existing datafeed')
      this._read()
    } else {
      this._create()
    }

    if (this.listenerCount('created') && process.env.NODE_ENV === 'production') {
      this.registerShutdownHooks()
    }
  }

  _fixFeedId(feedId) {
    return feedId === 'undefined' || feedId === 'null' ? null : feedId
  }

  _create() {
    DatafeedClient.createDatafeed().then(
      ({ id }) => {
        console.log('Created new datafeed')
        this.id = id
        this.emit('created', id)
        this._read()
      },
      err => {
        this._retryConnection(err)
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
            } else if (type === 'symphonyelementsaction') {
              const messages = SymElementsParser.parse(events)
              this.emit('symphonyelementsaction', messages)
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

        this.retries = 0
      },
      err => {
        this._retryConnection(err)
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

  _retryConnection(err) {
    let waitInterval = this._getExponentialWaitInterval(this.retries, this.MAX_WAIT_INTERVAL)
    let shouldContinueRetry = this._shouldContinueRetry(err)

    if (shouldContinueRetry) {
      setTimeout(() => {
        this.retries++

        SymConfigLoader.SymConfig.rotateAgent().then(() => {
          this.id = null
          this._create()
        })
      }, waitInterval)
    } else {
      try {
        this.emit('error', err)
      } catch (err) {
        // do nothing here, this try/catch is to avoid UnhandledPromiseRejectionWarning in unit tests
      }
    }
  }

  _getExponentialWaitInterval(retryCount, maxWaitInterval) {
    let waitInterval = Math.pow(2, retryCount) * 1000 // in milliseconds
    waitInterval = maxWaitInterval ? Math.min(waitInterval, maxWaitInterval) : waitInterval

    console.log(
      'DatafeedEventsService/_retryConnection/waitInterval',
      waitInterval / 1000 + ' seconds [#' + (this.retries + 1) + ']'
    )
    return waitInterval
  }

  _shouldContinueRetry(err) {
    let isErrNonBlocking = (err.statusCode === 400 || err.statusCode === 503 || err.statusCode === 'ECONNRESET' || err.statusCode === 'ECONNREFUSED')

    // Exit on 500 (Internal Server Error) only if there are no LBs,
    // otherwise try to reconnect to another agent
    if (SymConfigLoader.SymConfig.loadBalancing) {
      return this.retries < this.MAX_RETRIES
    } else {
      return isErrNonBlocking && this.retries < this.MAX_RETRIES
    }
  }
}

module.exports = DatafeedEventsService
