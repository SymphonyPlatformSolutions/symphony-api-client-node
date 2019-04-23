const { agentRequest } = require('../Request/clients')

const SignalsClient = {}

// List signals on behalf of the service user using https://rest-api.symphony.com/docs/list-signals
SignalsClient.listSignals = (skip = 0, limit = 50) =>
  agentRequest(
    'GET',
    `/agent/v1/signals/list?skip=${skip}&limit=${limit}`,
    'SignalsClient/listSignals'
  )

// Get information about a signal using https://rest-api.symphony.com/docs/get-signal
SignalsClient.getSignal = id =>
  agentRequest('GET', `/agent/v1/signals/${id}/get`, 'SignalsClient/getSignal')

// Create a new signal using https://rest-api.symphony.com/docs/create-signal
SignalsClient.createSignal = (name, query, visibleOnProfile = true, companyWide = false) => {
  const body = {
    name: name,
    query: query,
    visibleOnProfile: visibleOnProfile,
    companyWide: companyWide,
  }

  return agentRequest('POST', '/agent/v1/signals/create', 'SignalsClient/createSignal', body)
}

// Update an existing signal using https://rest-api.symphony.com/docs/update-signal
SignalsClient.updateSignal = (id, name, query, visibleOnProfile, companyWide) => {
  const body = {
    name: name,
    query: query,
    visibleOnProfile: visibleOnProfile,
    companyWide: companyWide,
  }

  return agentRequest('POST', `/agent/v1/signals/${id}/update`, 'SignalsClient/updateSignal', body)
}

// Delete an existing signal using https://rest-api.symphony.com/docs/delete-signal
SignalsClient.deleteSignal = id =>
  agentRequest('POST', `/agent/v1/signals/${id}/delete`, 'SignalsClient/deleteSignal')

// Subscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/subscribe-signal
// Note: To subscribe an entire pod to a Signal, set the companyWide field to true using SignalsClient.updateSignal
SignalsClient.subscribeSignal = (id, userIds, userCanUnsubscribe) => {
  const body = {
    users: userIds,
  }

  return agentRequest(
    'POST',
    `/agent/v1/signals/${id}/subscribe?pushed=${userCanUnsubscribe ? 'true' : 'false'}`,
    'SignalsClient/subscribeSignal',
    body
  )
}

// Unsubscribe user(s) to an existing signal using https://rest-api.symphony.com/docs/unsubscribe-signal
SignalsClient.unsubscribeSignal = (id, userIds) => {
  const body = {
    users: userIds,
  }

  return agentRequest(
    'POST',
    `/agent/v1/signals/${id}/unsubscribe`,
    'SignalsClient/unsubscribeSignal',
    body
  )
}

// List users subscribed to an existing signal using https://rest-api.symphony.com/docs/subscribers
SignalsClient.getSignalSubscribers = (id, skip = 0, limit = 50) =>
  agentRequest(
    'GET',
    `/agent/v1/signals/${id}/subscribers?skip=${skip}&limit=${limit}`,
    'SignalsClient/getSignalSubscribers'
  )

module.exports = SignalsClient
