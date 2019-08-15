const { podRequest } = require('../Request/clients')

const PresenceClient = {}

PresenceClient.STATUS_AVAILABLE = 'AVAILABLE'
PresenceClient.STATUS_BUSY = 'BUSY'
PresenceClient.STATUS_AWAY = 'AWAY'
PresenceClient.STATUS_ON_THE_PHONE = 'ON_THE_PHONE'
PresenceClient.STATUS_BE_RIGHT_BACK = 'BE_RIGHT_BACK'
PresenceClient.STATUS_IN_A_MEETING = 'IN_A_MEETING'
PresenceClient.STATUS_OUT_OF_OFFICE = 'OUT_OF_OFFICE'
PresenceClient.STATUS_OFF_WORK = 'OFF_WORK'

PresenceClient.getUserPresence = (userId, local) =>
  podRequest(
    'GET',
    `/pod/v3/user/${userId}/presence?local=${local ? 'true' : 'false'}`,
    'UsersClient/getUserPresence'
  )

PresenceClient.setPresence = status => {
  const body = {
    category: status
  }

  return podRequest('POST', '/pod/v2/user/presence', 'UsersClient/setPresence', body)
}

PresenceClient.registerInterestExtUser = () =>
  podRequest('POST', '/pod/v1/user/presence/register', 'UsersClient/registerInterestExtUser')

module.exports = PresenceClient
