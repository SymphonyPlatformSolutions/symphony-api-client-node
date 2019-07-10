const SymBotClient = require('../../lib/SymBotClient')

jest.mock('fs');
const mockFs = require('fs');

jest.mock('../../lib/SymBotAuth', () => ({
  authenticate: jest.fn(() => {
    return new Promise((resolve) => {
      resolve({
        sessionAuthToken: 'session-token',
        kmAuthToken: 'key-manager-token'
      });
    });
  })
}));

const mainMockConfig = {
  agentHost: 'agent.example.com',
  agentPort: 443,
  podHost: 'pod.example.com',
  podPort: 443,
};
const lbMockConfig = {
  loadBalancing: {
    method: 'random',
    stickySessions: true
  },
  agentServers: [
    'srv1.symphony.com',
    'srv2.symphony.com',
    'srv3.symphony.com'
  ]
};

describe('SymLoadBalancerConfigLoader', () => {

  beforeAll(() => {
    jest.clearAllMocks();
  });

  it('configues lb', () => {
    mockFs.readFile = jest.fn()
      .mockImplementationOnce((path, cb) => {
        return cb(null, JSON.stringify(mainMockConfig))
      })
      .mockImplementationOnce((path, cb) => {
        return cb(null, JSON.stringify(lbMockConfig))
      });

    return SymBotClient.initBot('a-path', 'b-path').then(symAuth => {
      expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));

      expect(symAuth.config.podHost).toEqual(mainMockConfig.podHost);

      expect(symAuth.config.loadBalancing.method).toEqual(lbMockConfig.loadBalancing.method);
      expect(symAuth.config.loadBalancing.method).toEqual(lbMockConfig.loadBalancing.method);
      expect(symAuth.config.agentServers.length).toEqual(lbMockConfig.agentServers.length);
    });
  });
});
