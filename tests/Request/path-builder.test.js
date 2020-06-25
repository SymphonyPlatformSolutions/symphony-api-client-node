const PathBuilder = require('../../lib/Request/path-builder')
const SymConfigLoader = require('../../lib/SymConfigLoader')

describe('buildPodPath', function () {
  const emptySymConfig = {};
  describe.each([
    ['', emptySymConfig, '/'],
    ['/', emptySymConfig, '/'],
    ['/path', emptySymConfig, '/path'],
    ['path', emptySymConfig, '/path'],
  ])('with undefined podContextPath with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithEmptyString = {podContextPath: ''};
  describe.each([
    ['', symConfigWithEmptyString, '/'],
    ['/', symConfigWithEmptyString, '/'],
    ['/path', symConfigWithEmptyString, '/path'],
    ['path', symConfigWithEmptyString, '/path'],
  ])('with empty string for podContextPath with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithSlash = {podContextPath: '/'};
  describe.each([
    ['', symConfigWithSlash, '/'],
    ['/', symConfigWithSlash, '/'],
    ['/path', symConfigWithSlash, '/path'],
    ['path', symConfigWithSlash, '/path'],
  ])('with empty string for podContextPath with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithContextPathBeginningWithSlash = {podContextPath: '/context'};
  describe.each([
    ['', symConfigWithContextPathBeginningWithSlash, '/context'],
    ['/', symConfigWithContextPathBeginningWithSlash, '/context/'],
    ['/path', symConfigWithContextPathBeginningWithSlash, '/context/path'],
    ['path', symConfigWithContextPathBeginningWithSlash, '/context/path'],
  ])('with non-empty podContextPath beginning with / with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithContextPathNotBeginningWithSlash = {podContextPath: 'context'};
  describe.each([
    ['', symConfigWithContextPathNotBeginningWithSlash, '/context'],
    ['/', symConfigWithContextPathNotBeginningWithSlash, '/context/'],
    ['/path', symConfigWithContextPathNotBeginningWithSlash, '/context/path'],
    ['path', symConfigWithContextPathNotBeginningWithSlash, '/context/path'],
  ])('with non-empty podContextPath not beginning with / with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithContextPathBeginningAndEndingWithSlash = {podContextPath: '/context/'};
  describe.each([
    ['', symConfigWithContextPathBeginningAndEndingWithSlash, '/context'],
    ['/', symConfigWithContextPathBeginningAndEndingWithSlash, '/context/'],
    ['/path', symConfigWithContextPathBeginningAndEndingWithSlash, '/context/path'],
    ['path', symConfigWithContextPathBeginningAndEndingWithSlash, '/context/path'],
  ])('with non-empty podContextPath beginning and ending with / with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });

  const symConfigWithContextPathEndingOnlyWithSlash = {podContextPath: 'context/'};
  describe.each([
    ['', symConfigWithContextPathEndingOnlyWithSlash, '/context'],
    ['/', symConfigWithContextPathEndingOnlyWithSlash, '/context/'],
    ['/path', symConfigWithContextPathEndingOnlyWithSlash, '/context/path'],
    ['path', symConfigWithContextPathEndingOnlyWithSlash, '/context/path'],
  ])('with non-empty podContextPath not beginning and ending with / with path = %s', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildPodPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });
});

describe('buildAgentPath', function () {
  describe.each([
    ['/path', {}, '/path'],
    ['/path', {agentContextPath: '/context'}, '/context/path'],
  ])('buildAgentPath %#', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildAgentPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });
});

describe('buildKeyAuthPath', function () {
  describe.each([
    ['/path', {}, '/path'],
    ['/path', {keyAuthContextPath: '/context'}, '/context/path'],
  ])('buildKeyAuthPath %#', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildKeyAuthPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });
});

describe('buildSessionAuthPath', function () {
  describe.each([
    ['/path', {}, '/path'],
    ['/path', {sessionAuthContextPath: '/context'}, '/context/path'],
  ])('buildSessionAuthPath %#', (path, symConfig, expectedFullPath) => {
    test(`returns ${expectedFullPath}`, () => {
      expect(PathBuilder.buildSessionAuthPath(path, symConfig)).toEqual(expectedFullPath);
    });
  });
});

// test with no provided SymConfig
describe('buildPathWithGlobalSymConfig', function () {
  test('Empty SymConfig', () => {
    SymConfigLoader.SymConfig = {}
    expect(PathBuilder.buildPodPath('/path')).toEqual('/path');
  })

  test('Non empty SymConfig', () => {
    SymConfigLoader.SymConfig = {podContextPath: '/context'}
    expect(PathBuilder.buildPodPath('/path')).toEqual('/context/path');
  })
});