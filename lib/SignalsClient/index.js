const { agentRequest } = require('../Request/clients')
const SymConfigLoader = require('../SymConfigLoader')

const SignalsClient = {}

// List signals on behalf of the service user using https://rest-api.symphony.com/docs/list-signals
SignalsClient.listSignals = (skip = 0, limit = 50, sessionToken) =>
  agentRequest(
    'GET',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/list?skip=${skip}&limit=${limit}`,
    'SignalsClient/listSignals',
    undefined,
    sessionToken
  )

// Get information about a signal using https://rest-api.symphony.com/docs/get-signal
SignalsClient.getSignal = (id, sessionToken) =>
  agentRequest(
    'GET',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/get`,
    'SignalsClient/getSignal',
    undefined,
    sessionToken
  )

// Create a new signal using https://rest-api.symphony.com/docs/create-signal
SignalsClient.createSignal = (name, query, visibleOnProfile = true, companyWide = false, sessionToken) => {
  const body = {
    name: name,
    query: query,
    visibleOnProfile: visibleOnProfile,
    companyWide: companyWide
  }

  return agentRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + '/agent/v1/signals/create',
    'SignalsClient/createSignal',
    body,
    sessionToken
  )
}

// Update an existing signal using https://rest-api.symphony.com/docs/update-signal
SignalsClient.updateSignal = (id, name, query, visibleOnProfile, companyWide, sessionToken) => {
  const body = {
    name: name,
    query: query,
    visibleOnProfile: visibleOnProfile,
    companyWide: companyWide
  }

  return agentRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/update`,
    'SignalsClient/updateSignal',
    body,
    sessionToken
  )
}

// Delete an existing signal using https://rest-api.symphony.com/docs/delete-signal
SignalsClient.deleteSignal = (id, sessionToken) =>
  agentRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/delete`,
    'SignalsClient/deleteSignal',
    undefined,
    sessionToken
  )

// Subscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/subscribe-signal
// Note: To subscribe an entire pod to a Signal, set the companyWide field to true using SignalsClient.updateSignal
SignalsClient.subscribeSignal = (id, userIds, userCanUnsubscribe, sessionToken) =>
  agentRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/subscribe?pushed=${userCanUnsubscribe ? 'true' : 'false'}`,
    'SignalsClient/subscribeSignal',
    userIds,
    sessionToken
  )

// Unsubscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/unsubscribe-signal
SignalsClient.unsubscribeSignal = (id, userIds, sessionToken) =>
  agentRequest(
    'POST',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/unsubscribe`,
    'SignalsClient/unsubscribeSignal',
    userIds,
    sessionToken
  )

// List users subscribed to an existing signal using https://rest-api.symphony.com/docs/subscribers
SignalsClient.getSignalSubscribers = (id, skip = 0, limit = 50, sessionToken) =>
  agentRequest(
    'GET',
    SymConfigLoader.SymConfig.pathPrefix + `/agent/v1/signals/${id}/subscribers?skip=${skip}&limit=${limit}`,
    'SignalsClient/getSignalSubscribers',
    undefined,
    sessionToken
  )

module.exports = SignalsClient
