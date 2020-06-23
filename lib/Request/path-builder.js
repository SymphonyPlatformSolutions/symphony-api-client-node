const SymConfigLoader = require('../SymConfigLoader')

let PathBuilder = {}

PathBuilder.buildAgentPath = (path, symConfig = SymConfigLoader.SymConfig) => {
  return buildFullPath(symConfig.agentContextPath, path);
}

PathBuilder.buildPodPath = (path, symConfig = SymConfigLoader.SymConfig) => {
  return buildFullPath(symConfig.podContextPath, path);
}

PathBuilder.buildKeyAuthPath = (path, symConfig = SymConfigLoader.SymConfig) => {
  return buildFullPath(symConfig.keyAuthContextPath, path);
}

PathBuilder.buildSessionAuthPath = (path, symConfig = SymConfigLoader.SymConfig) => {
  return buildFullPath(symConfig.sessionAuthContextPath, path);
}

function buildFullPath(contextPath, path) {
  if (!contextPath) {
    contextPath = '';
  }
  if (path && !path.startsWith('/')) {
    path = '/' + path;
  }
  if (contextPath.endsWith('/')) {
    contextPath = contextPath.substring(0, contextPath.length - 1);
  }

  let fullPath = contextPath + path;
  if (!fullPath.startsWith('/')) {
    fullPath = '/' + fullPath;
  }
  return fullPath;
}

module.exports = PathBuilder;