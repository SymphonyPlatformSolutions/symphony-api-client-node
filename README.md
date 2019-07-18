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

Symphony.initBot(__dirname + '/config.json').then(() => {
  Symphony.getDatafeedEventsService({ onMessage, onError })
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
    "keyAuthHost": "my-company-name-api.symphony.com",
    "keyAuthPort": 8444,
    "podHost": "my-company-name.symphony.com",
    "podPort": 443,
    "agentHost": "my-company-name.symphony.com",
    "agentPort": 443,

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
    "nodeTlsRejectUnauthorized": 0
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


# Release Notes

## 1.0.7
- Improved handling for stopping and shutdown of the `DatafeedEventsService` by including a stopping and shutdown event. The stopping event indicates when it starts to stop. The SDK user can use this event to start to shutdown its own services in preparation for a stop.

## 1.0.6
- Feature - Agent Server Load balancing
- Improved handling for Self-Signed certificates using `nodeTlsRejectUnauthorized` variable
- Fixed Error handling conflicts for `retryConnection`
- Updated NPM package dependencies to include latest versions

## 1.0.5
- Extended event service to report on all Symphony Datafeed events
- Upgrade of Jest and update to Node engine requirements

## 1.0.4
- Fix malformed proxyURL when using username and password authentication.
- Enhancement for resuming an existing datafeed. If upgrading to the new `getDatafeedEventsService` method signature,
  note that the new `onMessage` handler is passed a single `messages` parameter.
- Rewrite of DatafeedEventsService. Allowing for better management of datafeeds including,
 - restarting an existing datafeed
 - reporting the ID of a new datafeed
 - reporting when the datafeed has errored
 - reporting when the datafeed has stopped cleanly
 - preventing the node process from exiting until datafeed has stopped cleanly

## 1.0.3
- Fix to handle support for PKCS12 certificate files
- Enhancement for Proxy Support. Allow configuring pod, agent and key manager proxies independently.

## 1.0.2
- Fix to handle API calls returning HTTP 204 - No Content
- Security updates to latest packages within package.json

## 1.0.1
- Expose MessagesClient.getMessage() via SymBotClient

## 1.0.0
- MessagesClient now returns the original base64-encoded content on an attachment instead of uniformly converting to ascii.  This change allows retrieval of binary, base64 content, but impacts those clients who need ascii-encoded data.
- SymConfigLoader now checks for either undefined, or empty values for client proxy configuration in config.json (`proxyURL`)
- UsersClient now properly allows either uid-based, or email-based retrieval of user info in accordance with the users-lookup-v3 endoint as documented here: https://rest-api.symphony.com/reference#users-lookup-v3
- Fix StreamsClient/getUserIMStreamId - bad parameter name (userIds instead of userIDs
