const fs = require('fs')
const util = require('util')
const Q = require('q')

const request = require('../Request')
const PathBuilder = require('../Request/path-builder')
const SymBotAuth = require('../SymBotAuth')

let SymLoadBalancerConfigLoader = {}

const loadBalancingMethod = {
  RANDOM: 'random',
  ROUNDROBIN: 'roundrobin',
  EXTERNAL: 'external'
}

SymLoadBalancerConfigLoader.loadFromFile = (path, SymConfig) => {
  return util.promisify(fs.readFile)(path)
    .then(JSON.parse)
    .then((lbConfig) => SymLoadBalancerConfigLoader.loadFromObjects(lbConfig, SymConfig));
}

SymLoadBalancerConfigLoader.loadFromObjects = (lbConfig, SymConfig) => {
  return Q.fcall(() => {
    enhanceSymConfig(lbConfig, SymConfig)
    SymConfig.getAgentHost = getAgentHost
    SymConfig.rotateAgent = rotateAgent
    SymConfig.getActualAgentHost = getActualAgentHost
    return SymConfig
  });
}

function enhanceSymConfig (configFromFile, SymConfig) {
  SymConfig.currentAgentIndex = -1
  SymConfig.actualAgentHost = ''

  SymConfig.loadBalancing = configFromFile.loadBalancing
  SymConfig.agentServers = configFromFile.agentServers
}

async function getAgentHost () {
  let isSticky = this.loadBalancing.stickySessions

  switch (this.loadBalancing.method) {
    case loadBalancingMethod.RANDOM:
      if (this.currentAgentIndex === -1 || !isSticky) {
        await this.rotateAgent()
      }
      this.agentHost = this.agentServers[this.currentAgentIndex]
      break
    case loadBalancingMethod.ROUNDROBIN:
      if (this.currentAgentIndex === -1) {
        this.currentAgentIndex++
      }
      this.agentHost = this.agentServers[this.currentAgentIndex]
      if (!isSticky) {
        await this.rotateAgent()
      }
      break
    case loadBalancingMethod.EXTERNAL:
      if (!this.actualAgentHost || !isSticky) {
        await this.rotateAgent()
      }
      this.agentHost = this.actualAgentHost
      break
  }
  if (SymBotAuth.debug) {
    console.log(
      '[DEBUG]',
      'SymLoadBalancerConfigLoader/getAgentHost/this.agentHost',
      this.agentHost
    )
  }
  return this.agentHost
}

async function rotateAgent () {
  switch (this.loadBalancing.method) {
    case loadBalancingMethod.RANDOM:
      this.currentAgentIndex = getRandomInt(0, this.agentServers.length - 1)
      break
    case loadBalancingMethod.ROUNDROBIN:
      this.currentAgentIndex++
      if (this.currentAgentIndex === this.agentServers.length) {
        this.currentAgentIndex = 0
      }
      break
    case loadBalancingMethod.EXTERNAL:
      this.actualAgentHost = await this.getActualAgentHost()
      break
  }
}

function getActualAgentHost () {
  const externalAgentHost = (this.agentServers && this.agentServers.length > 0) ?
    this.agentServers[0] : this.getAgentHost()

  const options = {
    hostname: externalAgentHost,
    port: this.agentPort,
    path: PathBuilder.buildAgentPath(`/gethost`),
    method: 'GET'
  }

  return request(options, 'SymLoadBalancerConfigLoader/getActualAgentHost', null, true).then(response => {
    let body = JSON.parse(response.body)
    return body.serverFqdn
  })
}

function getRandomInt (min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = SymLoadBalancerConfigLoader
