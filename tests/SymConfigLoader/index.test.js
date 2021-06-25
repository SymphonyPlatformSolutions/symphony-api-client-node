const SymConfigLoader = require('../../lib/SymConfigLoader');

jest.mock('fs');
const mockFs = require('fs');

describe('SymConfigLoader', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('proxy config', () => {
    describe('agent proxy', () => {
      it('creates a proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://agent-proxy-url/',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.agentProxy.proxy.href).toEqual('https://agent-proxy-url/');
        });
      });

      it('creates a proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://agent-proxy-url/',
        }).then(config => {
          expect(config.agentProxy.proxy.href).toEqual('https://agent-proxy-url/');
        });
      });

      it('creates an authenticated proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://agent-proxy-url/',
            proxyUsername: 'test-user',
            proxyPassword: 'test-pass',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.agentProxy.proxy.href).toEqual(
            'https://test-user:test-pass@agent-proxy-url/'
          );
        });
      });

      it('creates an authenticated proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://agent-proxy-url/',
          proxyUsername: 'test-user',
          proxyPassword: 'test-pass',
        }).then(config => {
          expect(config.agentProxy.proxy.href).toEqual(
            'https://test-user:test-pass@agent-proxy-url/'
          );
        });
      });

      it('encodes special characters', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://agent-proxy-url/',
            proxyUsername: 'test-user-$%',
            proxyPassword: 'test-pass-$%',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.agentProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@agent-proxy-url/'
          );
        });
      });

      it('encodes special characters from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://agent-proxy-url/',
          proxyUsername: 'test-user-$%',
          proxyPassword: 'test-pass-$%',
        }).then(config => {
          expect(config.agentProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@agent-proxy-url/'
          );
        });
      });
    });


    describe('pod proxy', () => {
      it('creates a proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://pod-proxy-url/',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.podProxy.proxy.href).toEqual('https://pod-proxy-url/');
        });
      });

      it('creates a proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://pod-proxy-url/',
        }).then(config => {
          expect(config.podProxy.proxy.href).toEqual('https://pod-proxy-url/');
        });
      });

      it('creates an authenticated proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://pod-proxy-url/',
            proxyUsername: 'test-user',
            proxyPassword: 'test-pass',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.podProxy.proxy.href).toEqual(
            'https://test-user:test-pass@pod-proxy-url/'
          );
        });
      });

      it('creates an authenticated proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://pod-proxy-url/',
          proxyUsername: 'test-user',
          proxyPassword: 'test-pass',
        }).then(config => {
          expect(config.podProxy.proxy.href).toEqual(
            'https://test-user:test-pass@pod-proxy-url/'
          );
        });
      });

      it('encodes special characters', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            proxyURL: 'https://pod-proxy-url/',
            proxyUsername: 'test-user-$%',
            proxyPassword: 'test-pass-$%',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.podProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@pod-proxy-url/'
          );
        });
      });

      it('encodes special characters from object', () => {
        return SymConfigLoader.loadFromObject({
          proxyURL: 'https://pod-proxy-url/',
          proxyUsername: 'test-user-$%',
          proxyPassword: 'test-pass-$%',
        }).then(config => {
          expect(config.podProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@pod-proxy-url/'
          );
        });
      });

      it('creates a proxy for only the pod', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            podProxyURL: 'https://pod-proxy-url/',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.podProxy.proxy.href).toEqual('https://pod-proxy-url/');
          expect(config.agentProxy).toBeUndefined();
        });
      });

      it('creates a proxy for only the pod from object', () => {
        return SymConfigLoader.loadFromObject({
          podProxyURL: 'https://pod-proxy-url/',
        }).then(config => {
          expect(config.podProxy.proxy.href).toEqual('https://pod-proxy-url/');
          expect(config.agentProxy).toBeUndefined();
        });
      });
    });

    describe('keyManager proxy', () => {
      it('creates a proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            keyManagerProxyURL: 'https://km-proxy-url/',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.keyManagerProxy.proxy.href).toEqual('https://km-proxy-url/');
        });
      });

      it('creates a proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          keyManagerProxyURL: 'https://km-proxy-url/',
        }).then(config => {
          expect(config.keyManagerProxy.proxy.href).toEqual('https://km-proxy-url/');
        });
      });

      it('creates an authenticated proxy', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            keyManagerProxyURL: 'https://km-proxy-url/',
            keyManagerProxyUsername: 'test-user',
            keyManagerProxyPassword: 'test-pass',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.keyManagerProxy.proxy.href).toEqual(
            'https://test-user:test-pass@km-proxy-url/'
          );
        });
      });

      it('creates an authenticated proxy from object', () => {
        return SymConfigLoader.loadFromObject({
          keyManagerProxyURL: 'https://km-proxy-url/',
          keyManagerProxyUsername: 'test-user',
          keyManagerProxyPassword: 'test-pass',
        }).then(config => {
          expect(config.keyManagerProxy.proxy.href).toEqual(
            'https://test-user:test-pass@km-proxy-url/'
          );
        });
      });

      it('encodes special characters', () => {
        mockFs.readFile = jest.fn((path, cb) => {
          return cb(null, JSON.stringify({
            keyManagerProxyURL: 'https://km-proxy-url/',
            keyManagerProxyUsername: 'test-user-$%',
            keyManagerProxyPassword: 'test-pass-$%',
          }))
        });

        return SymConfigLoader.loadFromFile('a-path').then(config => {
          expect(mockFs.readFile).toHaveBeenCalledWith('a-path', expect.any(Function));
          expect(config.keyManagerProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@km-proxy-url/'
          );
        });
      });

      it('encodes special characters from object', () => {
        return SymConfigLoader.loadFromObject({
          keyManagerProxyURL: 'https://km-proxy-url/',
          keyManagerProxyUsername: 'test-user-$%',
          keyManagerProxyPassword: 'test-pass-$%',
        }).then(config => {
          expect(config.keyManagerProxy.proxy.href).toEqual(
            'https://test-user-%24%25:test-pass-%24%25@km-proxy-url/'
          );
        });
      });
    });
  });
});
