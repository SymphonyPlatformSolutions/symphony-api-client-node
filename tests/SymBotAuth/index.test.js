const SymBotAuth = require('../../lib/SymBotAuth');

jest.mock('fs');
jest.mock('https');
const mockFs = require('fs');
const mockHttps = require('https');

describe('SymBotAuth', () => {
  beforeEach(() => {
    mockFs.readFileSync = jest.fn((path) => "Contents of " + path);

    mockHttps.request = jest.fn(() => ({
      end: jest.fn(),
      on: jest.fn(),
      setTimeout: jest.fn()
    }));
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('sessionAuthenticate', () => {
    describe('when the auth type is not rsa', () => {
      test('POSTs to /sessionauth/v1/authenticate with the correct parameters', () => {
        SymBotAuth.sessionAuthenticate({
          botCertPath: "/",
          botCertName: "I am the cert",
          sessionAuthHost: "https://session.example.com",
          sessionAuthPort: 1234,
          botCertPassword: "Passphrase",
          podProxy: "agent"
        });

        expect(mockHttps.request.mock.calls).toMatchSnapshot();
      });
    });
  });

  describe('kmAuthenticate', () => {
    describe('when the auth type is not rsa', () => {
      test('POSTs to /keyauth/v1/authenticate with the correct parameters', () => {
        SymBotAuth.kmAuthenticate({
          botCertPath: "/",
          botCertName: "I am the cert",
          keyAuthHost: "https://key.example.com",
          keyAuthPort: 5678,
          botCertPassword: "Passphrase",
          keyManagerProxy: "agent"
        });

        expect(mockHttps.request.mock.calls).toMatchSnapshot();
      });
    });
  });
});
