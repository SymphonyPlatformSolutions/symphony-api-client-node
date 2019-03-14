# symphony-api-client-node
Symphony API Client for NodeJS

## Installation

``npm install --save symphony-api-client-node``

## Usage

```javascript
const Symphony = require('symphony-api-client-node');

const botHearsSomething = ( event, messages ) => {
  messages.forEach( (message, index) => {
    console.log( 'The BOT heard "' + message.messageText +'" from ' + message.initiator.user.displayName );
  })
}

Symphony.initBot(__dirname + '/config.json').then( (symAuth) => {
  Symphony.getDatafeedEventsService( botHearsSomething );
})
```
## Configuration
The `config.json` file is described on the [Configuration page](https://symphony-developers.symphony.com/docs/configuration-1) of the Symphony Developer Guide.

Create a config.json file in your project.  Below is a sample configuration which includes the properties that can be configured:

        {
          "sessionAuthHost": "podDomain-api.symphony.com",
          "sessionAuthPort": 8444,
          "keyAuthHost": "podDomain.symphony.com",
          "keyAuthPort": 8444,
          "podHost": "podDomain.symphony.com",
          "podPort": 443,
          "agentHost": "podDomain.symphony.com",
          "agentPort": 443,
          "botCertPath": "PATH",
          "botCertName": "BOT-CERT-NAME",
          "botCertPassword": "BOT-PASSWORD",
          "botEmailAddress": "BOT-EMAIL-ADDRESS",
          "appCertPath": "",
          "appCertName": "",
          "appCertPassword": "",
          "proxyURL": "",
          "proxyUsername": "",
          "proxyPassword": ""
        }

Note: The proxyURL value should be defined as follows 'http://proxy.company.com:port'

# Release Notes

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
