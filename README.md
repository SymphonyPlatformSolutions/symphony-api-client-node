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

The `config.json` file is described on the [Configuration page](https://symphony-developers.symphony.com/docs/configuration-1) of the Symphony Developer Guide.
