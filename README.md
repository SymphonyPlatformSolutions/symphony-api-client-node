# symphony-api-client-node
Symphony API Client for NodeJS

## Installation

`npm install --save symphony-api-client-node`

## Usage

```javascript
const Symphony = require('symphony-api-client-node')

const onMessage = messages => {
  messages.forEach(message => {
    console.log(
      'The BOT heard "' + message.messageText + '" from ' + message.user.displayName
    )
  })
}

const onError = error => {
  console.error('Error reading data feed', error)
}

Symphony.initBot(__dirname + '/config.json')
.then(() => {
  Symphony.getDatafeedEventsService({ onMessage, onError })
})
.fail(err => {
  console.error(err)
})
```

## Configuration

The `config.json` file is described on the [Configuration page](https://symphony-developers.symphony.com/docs/configuration-1) of the Symphony Developer Guide.

Create a config.json file in your project.  Below is a sample configuration which includes the properties that can be configured:

```json5
{
    // Mandatory section
    "sessionAuthHost": "my-company-name-api.symphony.com",
    "sessionAuthPort": 8444,
    "sessionAuthContextPath": "/app",
    "keyAuthHost": "my-company-name-api.symphony.com",
    "keyAuthPort": 8444,
    "keyAuthContextPath": "/app",
    "podHost": "my-company-name.symphony.com",
    "podPort": 443,
    "podContextPath": "/app",
    "agentHost": "my-company-name.symphony.com",
    "agentPort": 443,
    "agentContextPath": "/app",

    // For bots only
    "botUsername": "my-bot-name",
    "botEmailAddress": "bot@company.com",
    // For bots using RSA authentication
    "botPrivateKeyPath": "/path/to/rsa/private-key/",
    "botPrivateKeyName": "bot-private-key.pem",
    // For bots using certificate authentication
    "botCertPath": "/path/to/bot-cert/",
    "botCertName": "bot-cert.p12",
    "botCertPassword": "bot-cert-password",

    // For extension apps only
    "appId": "",
    // For extension apps using RSA authentication
    "appPrivateKeyPath": "",
    "appPrivateKeyName": "",
    // For extension apps using certificate authentication
    "appCertPath": "/path/to/app-cert/",
    "appCertName": "app-cert.p12",
    "appCertPassword": "app-cert-password",

    // Optional: If the connection to the pod (but not the agent) needs to run through a proxy
    "podProxyURL": "http://localhost:3128",
    "podProxyUsername": "proxy-username",
    "podProxyPassword": "proxy-password",

    // Optional: If the connection to both the pod and the agent needs to run through a proxy
    // Do not include the podProxy properties if using this
    "proxyURL": "http://localhost:3128",
    "proxyUsername": "proxy-username",
    "proxyPassword": "proxy-password",

    // Optional: If the connection to the key manager needs to run through a proxy
    "keyManagerProxyURL": "http://localhost:3128",
    "keyManagerProxyUsername": "proxy-username",
    "keyManagerProxyPassword": "proxy-password",

    // Optional: Self Signed Certificates - Set to 0 to not reject invalid or self-signed certificates
    "nodeTlsRejectUnauthorized": 0,

    // Optional: maximum number of retries to reconnect to the agent, default value is 10
    "maxRetries": 10,

    // Optional: maximum waiting time between retries in the exponential backoff algorithm,
    // default is 64 seconds, like in Google Cloud Storage lib
    "maxWaitInterval": 64
}
```

## Datafeed resuming

Datafeeds buffer events on the agent up to a small limit. This allows bots to be restarted without missing any events,
provided the datafeed ID is persisted and supplied when reconnecting.

```javascript
const fs = require('fs')
const localFile = '/path/to/writable/file' // <- change this

const loadId = () => fs.readFileSync(localFile, { encoding: 'utf-8', flag: 'a+' })
const saveId = id => fs.writeFile(localFile, id, err => err && console.error(err))

const feed = Symphony.getDatafeedEventsService({
  onMessage,
  onError,
  onCreated: saveId,
  feedId: loadId(),
})
```

This simple example assumes that the file system is persisted across restarts which is not always the case
(e.g. Docker containers). It is recommended to persist the datafeed ID to a database instead if available.

### Shutting down a bot

There is a known issue that can cause messages to be lost when stopping and resuming a datafeed.
To avoid this, the datafeed service must hook into Node's exit events and prevent the process
from exiting until the data feed has closed cleanly (up to 30 seconds). This is done automatically
if the `NODE_ENV` environment variable is set to 'production' _and_ a datafeed 'created' listener
has been registered (see above). In other cases the behaviour can be opted into by calling
`registerShutdownHooks()` on the feed instance.

See [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)
for examples of how to set environment variables.

## Datafeed event types

As well as messages, the datafeed reports a number of other events. See the
[documentation for real time events](https://developers.symphony.com/restapi/docs/real-time-events).
These can be accessed by adding corresponding event listeners to the feed service. For example:

```javascript
Symphony.getDatafeedEventsService({
    onMessage,
    onError,
    onUserjoinedroom: events => {
      for (let event of events) {
        const initiator = event.initiator.user.displayName
        const user = event.payload.userJoinedRoom.affectedUser.displayName
        const room = event.payload.userJoinedRoom.stream.roomName
        console.log(`${initiator} added ${user} to ${room}`)
      }
    },
  })
```

## Symphony Elements Example Usage

```javascript
const messageHandler = (event, messages) => {
  messages.forEach((message, index) => {
    let reply_message = 'Hello ' + message.user.firstName + ', hope you are doing well!!'
    Symphony.sendMessage(message.stream.streamId, reply_message, null, Symphony.MESSAGEML_FORMAT)
  })
}

const elementsHandler = (event, actions) => {
  actions.forEach((action, index) => {
    console.log(action)
  })
}

Symphony.initBot(__dirname + '/config.json')
  .then((symAuth) => {
    const handlers = {
      onMessageSent: messageHandler.bind(null, 'MESSAGE_RECEIVED'),
      onSymphonyElementsAction: elementsHandler.bind(null, 'ELEMENTS_ACTION_RECEIVED')
    }
    Symphony.getDatafeedEventsService(handlers)
  })
  ```

## Symphony Elements Form Builder

```javascript
const formML = Symphony
  .formBuilder('my-form')
  .addDiv("hello")
  .addLineBreaks(3)
  .addHeader(6, "Yes")
  .addTextField('my-text-field', '', 'Type something')
  .addButton('my-button', 'Button')
  .addTextArea('my-ta', 'displayed', 'type here')
  .addCheckBox('my-cb', 'Hey CB', 'x')
  .addRadioButton('my-rb', 'Hey RB', 'rb-val')
  .addPersonSelector('my-ps', 'Select people', true)
  .addTableSelect('my-ts', )
  .addLineBreak()
  .formatElement()
Symphony.sendMessage('streamId', formML)
```

## Advanced Configuration for Load Balancing
Create an additional configuration file to support load balancing.  There are 3 supported types:
* Round-Robin
* Random
* External

Round-robin and random load balancing are managed by this library based on the servers provided in the agentServers array.

External load-balancing is managed by an external DNS, cloud provider or hardware-based solution. List only one load balancer frontend hostname in the agentServers array (subsequent server entries for the external method are ignored).

**Note:** that this method requires all underlying agent servers to implement an additional `host.name` switch with the current server's FQDN in their `startup.sh` script.

```bash
exec java $JAVA_OPTS -Dhost.name=sym-agent-01.my-company.com
```

There is also support for sticky sessions, which should be true for any bot that requires the datafeed loop. Using non-sticky load-balanced configuration with a datafeed loop will result in unexpected results.
```json5
{
    "loadBalancing": {
        "method": "random", // or roundrobin or external
        "stickySessions": true
    },
    "agentServers": [
        "sym-agent-01.my-company.com",
        "sym-agent-02.my-company.com",
        "sym-agent-03.my-company.com"
    ]
}
```

### Loading advanced configuration
To load the configuration

```
Symphony.initBot(__dirname + '/config.json', __dirname + '/lb-config.json')
```
