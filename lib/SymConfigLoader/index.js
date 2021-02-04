const fs = require('fs')
const util = require('util')
const Q = require('q')
const HttpsProxyAgent = require('https-proxy-agent')
const url = require('url')

let SymConfigLoader = {}

SymConfigLoader.loadFromFile = (path) => {
  // using util.promisify instead of fs/promise because of unit tests mocking fs.readFile
  return util.promisify(fs.readFile)(path)
    .then(JSON.parse)
    .then(SymConfigLoader.loadFromObject);
}

SymConfigLoader.loadFromObject = (config) => {
  return Q.fcall(() => {
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
          const proxyUrl = url.parse(config[urlKey])
          proxyUrl.auth = `${config[usernameKey]}:${config[passwordKey]}`
          proxyURI = url.format(proxyUrl)
        } else {
          proxyURI = config[urlKey]
        }
        config[proxyKey] = new HttpsProxyAgent(proxyURI)
      }
    })

    // compatibility with SymLoadBalancerConfigLoader,
    // if LB is used, these functions are overridden
    config.getAgentHost = async () => config.agentHost
    config.rotateAgent = async () => {
    }

    // Do not reject self-signed certificates for API calls
    // ** Do not set this variable for Production Environments **
    if (config.nodeTlsRejectUnauthorized === 0) {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0
    }
    SymConfigLoader.SymConfig = config;
    return config;
  });
}

module.exports = SymConfigLoader
