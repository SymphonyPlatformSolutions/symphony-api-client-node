const fs = require('fs')
const Q = require('kew')
const HttpsProxyAgent = require('https-proxy-agent')
const url = require('url');

var SymConfigLoader = {}

SymConfigLoader.loadFromFile = (path) => {
  var defer = Q.defer()

  fs.readFile(path, function (err, data) {
    if (err) {
      defer.reject(err)
      return
    }

    let config
    try {
      config = JSON.parse(data)
    } catch (err) {
      defer.reject(err)
      return
    }

    // back compat
    if (config.proxyURL) {
      config.podProxyURL = config.proxyURL
      config.podProxyUsername = config.proxyUsername
      config.podProxyPassword = config.proxyPassword
      config.agentProxyURL = config.proxyURL
      config.agentProxyUsername = config.proxyUsername
      config.agentProxyPassword = config.proxyPassword
    }

    // create proxy agents
    const endpointTypes = ['keyManager', 'agent', 'pod']
    endpointTypes.forEach(type => {
      const urlKey = `${type}ProxyURL`
      const usernameKey = `${type}ProxyUsername`
      const passwordKey = `${type}ProxyPassword`
      const proxyKey = `${type}Proxy`

      if (config[urlKey]) {
        let proxyURI
        if (config[usernameKey]) {
          const proxyUrl = url.parse(config[urlKey]);
          proxyUrl.auth = `${config[usernameKey]}:${config[passwordKey]}`;
          proxyURI = url.format(proxyUrl);
        } else {
          proxyURI = config[urlKey]
        }
        config[proxyKey] = new HttpsProxyAgent(proxyURI)
      }
    })

    SymConfigLoader.SymConfig = config
    defer.resolve(config)
  })

  return defer.promise
}

module.exports = SymConfigLoader
