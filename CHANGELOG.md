# Release Notes
## 1.1.0
- Bug fix. Support non-json responses.

## 1.0.13
- Bug fix. Wrong signingKey was being used for SymBotAuth.getAppJwtToken. (https://github.com/SymphonyPlatformSolutions/symphony-api-client-node/issues/66)

## 1.0.12
- Update amends how the Datafeed Service handles 503 errors.  Addition of connection retry for 503 status code events.

## 1.0.11
- Addition of Symphony Elements Support.

## 1.0.10
- Addition of Data Entity Helpers to SymMessageParser.  Allowing you to parse Symphony messages to extract getCashtags(), getHashtags or getMentions() directly.

## 1.0.9
- Support for Application Authentication
- Support for OBO authentication

## 1.0.8
- Improved Datafeed connection retry logic.  Addition of exponential backoff and managed retries.  You can now set the `maxRetries` and `maxWaitInterval` for retrying Agent server connections.

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
