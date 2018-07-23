const https = require('https');
const FormData = require('form-data');
const Q = require('kew');
const PubSub = require('pubsub-js');
const SymConfigLoader = require('../SymConfigLoader');
const SymBotAuth = require('../SymBotAuth');
//const MessagesClient = require('../MessagesClient')

var StreamsClient = {};

StreamsClient.PRESENTATIONML_FORMAT = 'presentationML';
StreamsClient.MESSAGEML_FORMAT = 'messageML';

// Get StreamID for user(s) using https://rest-api.symphony.com/docs/create-im-or-mim
StreamsClient.getUserIMStreamId = (userId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/im/create",
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        userId
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/getUserIMStreamId/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Create room using https://rest-api.symphony.com/docs/create-room-v3
StreamsClient.createRoom = (room,description, keywords, membersCanInvite = true, discoverable = true, anyoneCanJoin = false, readOnly = false, copyProtected = false, crossPod = false, viewHistory = false) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v3/room/create",
      "method": "POST",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
        "Content-Type": "application/json",
        //"Content-Length": body.length,
      },
      "body": JSON.stringify({
        "name": room,
        "description": description,
        "keywords": keywords,
        "membersCanInvite": membersCanInvite,
        "discoverable": discoverable,
        "public": anyoneCanJoin,
        "readOnly": readOnly,
        "copyProtected": copyProtected,
        "crossPod": crossPod,
        "viewHistory": viewHistory
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/createRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Update room using https://rest-api.symphony.com/docs/update-room-v3
StreamsClient.updateRoom = (streamId, room, description, keywords, membersCanInvite, discoverable, anyoneCanJoin, readOnly, copyProtected, crossPod, viewHistory) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v3/room/" + streamId + "/update",
      "method": "POST",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
        "Content-Type": "application/json",
        //"Content-Length": body.length,
      },
      "body": JSON.stringify({
        "name": room,
        "description": description,
        "keywords": keywords,
        "membersCanInvite": membersCanInvite,
        "discoverable": discoverable,
        "public": anyoneCanJoin,
        "readOnly": readOnly,
        "copyProtected": copyProtected,
        "crossPod": crossPod,
        "viewHistory": viewHistory
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/updateRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Room Information using https://rest-api.symphony.com/docs/room-info-v3
StreamsClient.getRoomInfo = (streamId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v3/room/" + streamId + "/info",
      "method": "GET",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/getRoomInfo/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Re-Activate Room using https://rest-api.symphony.com/docs/de-or-re-activate-room
StreamsClient.activateRoom = (streamId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/setActive?active=true",
      "method": "POST",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/activateRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// De-Activate Room using https://rest-api.symphony.com/docs/de-or-re-activate-room
StreamsClient.deactivateRoom = (streamId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/setActive?active=false",
      "method": "POST",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/deactivateRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Room Members using https://rest-api.symphony.com/docs/room-members
StreamsClient.getRoomMembers = (streamId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v2/room/" + streamId + "/membership/list",
      "method": "GET",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(chunk) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/getRoomMembers/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Add Member to existing room using https://rest-api.symphony.com/docs/add-member
StreamsClient.addMemberToRoom = (streamId, userId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/membership/add",
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "id": userId
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/addMemberToRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Remove Member to existing room using https://rest-api.symphony.com/docs/remove-member
StreamsClient.removeMemberFromRoom = (streamId, userId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/membership/remove",
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "id": userId
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/removeMemberFromRoom/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Promote Member to owner of room using https://rest-api.symphony.com/docs/promote-owner
StreamsClient.promoteUserToOwner = (streamId, userId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/membership/promoteOwner",
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "id": userId
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/promoteUserToOwner/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Demote Member from owner of room using https://rest-api.symphony.com/docs/promote-owner
StreamsClient.demoteUserFromOwner = (streamId, userId) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/room/" + streamId + "/membership/demoteOwner",
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "id": userId
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/demoteUserFromOwner/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// Search Rooms using https://rest-api.symphony.com/docs/search-rooms-v3
StreamsClient.searchRooms = (skip = 0, limit = 100, query, labels, active = true, includePrivateRooms = false, creator, owner, member, sortOrder = 'RELEVANCE') => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v3/room/search?skip=" + skip + "&limit=" + limit,
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "query": query,
        "labels": labels,
        "active": active,
        "private": includePrivateRooms,
        "creator": creator,
        "owner": owner,
        "member": member,
        "sortOrder": sortOrder
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/searchRooms/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

// List User Streams using https://rest-api.symphony.com/docs/list-user-streams
StreamsClient.getUserStreams = (skip = 0, limit = 100, streamTypes, includeInactiveStreams) => {
  var defer = Q.defer();

  var options = {
      "hostname": SymConfigLoader.SymConfig.podHost,
      "port": SymConfigLoader.SymConfig.podPort,
      "path": "/pod/v1/streams/list?skip=" + skip + "&limit=" + limit,
      "method": "POST",
      "Content-Type": "application/json",
      "headers": {
        "sessionToken": SymBotAuth.sessionAuthToken,
      },
      "body": JSON.stringify({
        "streamTypes": streamTypes,
        "includeInactiveStreams": includeInactiveStreams
      })
  };

  var req = https.request(options, function(res) {
      var str = '';
      res.on('data', function(body) {
          str += chunk;
      });
      res.on('end', function() {
          if (SymBotAuth.debug) {
            console.log( '[DEBUG]', 'StreamsClient/getUserStreams/str', str);
          }
          defer.resolve(JSON.parse(str));
      });
  });

  req.end();

  return defer.promise;
}

module.exports = StreamsClient;
