const fs = require('fs')
const Q = require('kew')
const HttpsProxyAgent = require('https-proxy-agent')

var SymConfigLoader = {}

SymConfigLoader.loadFromFile = (path) => {
  var defer = Q.defer()

  fs.readFile(path, function (err, data) {
    if (err) {
      defer.reject(err)
    } else {
      var config = JSON.parse(data)
      // proxy detection
      if (config.proxyURL !== null && config.proxyURL !== '') {
        let endpoint = config.proxyURL.substring(config.proxyURL.indexOf('://') + 3)
        let protocol = config.proxyURL.substring(0, config.proxyURL.indexOf('://'))
        let proxyURI = ''
        if (config.proxyUsername !== null && config.proxyUsername !== '') {
          proxyURI = protocol + config.proxyUsername + ':' + config.proxyPassword + '@' + endpoint
        } else {
          proxyURI = config.proxyURL
        }
        config.proxy = new HttpsProxyAgent(proxyURI)
      }
      SymConfigLoader.SymConfig = config
      defer.resolve(config)
    }
  })

  return defer.promise
}

module.exports = SymConfigLoader
