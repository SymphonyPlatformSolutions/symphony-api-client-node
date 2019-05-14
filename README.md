# symphony-api-client-node
Symphony API Client for NodeJS

## Installation

``npm install --save symphony-api-client-node``

## Usage

```javascript
const Symphony = require('symphony-api-client-node');

const messageHandler = (eventName, messages) => {
  messages.forEach(message => {
    console.log('The BOT heard "' + message.messageText +'" from ' + message.initiator.user.displayName);
  })
}

const errorHandler = error => {
  console.error('Error reading data feed', error)
}

Symphony.initBot(__dirname + '/config.json').then(() => {
  Symphony.getDatafeedEventsService(messageHandler, errorHandler);
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
}
```

## Datafeed resuming

Datafeeds buffer events on the agent up to a small limit. This allows bots to be restarted without missing any events,
provided the datafeed ID is persisted and supplied when reconnecting.

```javascript
const feedId = /* load feed ID from storage */;
const feed = Symphony.getDatafeedEventsService(messageHandler, errorHandler, feedId);
feed.on('created', newFeedId => /* save new feed ID to storage */);
 ```

### Shutting down a bot

There is a known issue that can cause messages to be lost when stopping and resuming a datafeed.
To avoid this, the datafeed service must hook into Node's exit events and prevent the process
from exiting until the data feed has closed cleanly (up to 30 seconds). This is done automatically
if the `NODE_ENV` environment variable is set to 'production' *and* a datafeed 'created' listener
has been registered (see above). In other cases the behaviour can be opted into by calling
`registerShutdownHooks()` on the feed instance.

See [Express Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html#set-node_env-to-production)
for examples of how to set environment variables.

# Release Notes

## 1.0.4
- Fix malformed proxyURL when using username and password authentication.
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
