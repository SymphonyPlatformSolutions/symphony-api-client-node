const { podRequest } = require('../Request/clients')

const AdminUserClient = {}

// Get User V2 using https://rest-api.symphony.com/reference#get-user-v2
AdminUserClient.getUser = id =>
  podRequest('get', `/pod/v2/admin/user/${id}`, 'AdminUserClient/getUser')

// List all users using https://rest-api.symphony.com/reference#list-users-v2
AdminUserClient.listUsers = (skip = 0, limit = 1000) =>
  podRequest(
    'get',
    `/pod/v2/admin/user/list?skip=${skip}&limit=${limit}`,
    'AdminUserClient/listUsers'
  )

module.exports = AdminUserClient
