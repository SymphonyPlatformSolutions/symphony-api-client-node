const { podRequest } = require('../Request/clients')
const SymConfigLoader = require('../SymConfigLoader')

const UsersClient = {}

// Look up user with a username via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromUsername = username =>
  podRequest('get', SymConfigLoader.SymConfig.pathPrefix + `/pod/v2/user?username=${username}`, 'UsersClient/getUserFromUsername')

// Look up user with an email via https://rest-api.symphony.com/reference#user-lookup
UsersClient.getUserFromEmail = (email, local) =>
  podRequest(
    'get',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v2/user?email=${email}&local=${local ? 'true' : 'false'}`,
    'UsersClient/getUserFromEmail'
  )

// Look up user with one or more comma separated emails via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromEmailV3 = (email, local) =>
  podRequest(
    'get',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v3/users?email=${email}&local=${local ? 'true' : 'false'}`,
    'UsersClient/getUserFromEmailV3'
  )

// Look up user with one or more comma separated via https://rest-api.symphony.com/reference#users-lookup-v3
UsersClient.getUserFromIdV3 = (id, local) =>
  podRequest(
    'get',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v3/users?uid=${id}&local=${local ? 'true' : 'false'}`,
    'UsersClient/getUserFromIdV3'
  )

// Aliases for backward compatibility
UsersClient.getUsersFromEmailList = UsersClient.getUserFromEmailV3
UsersClient.getUsersFromIdList = UsersClient.getUserFromIdV3

// Search for users using https://rest-api.symphony.com/reference#search-users
UsersClient.searchUsers = (query, local, skip, limit, filter) => {
  const body = {
    query: query,
    filter: filter
  }

  return podRequest(
    'post',
    SymConfigLoader.SymConfig.pathPrefix + `/pod/v1/user/search?local=${local ? 'true' : 'false'}&skip=${skip}&limit=${limit}`,
    'UsersClient/searchUsers',
    body
  )
}

module.exports = UsersClient
