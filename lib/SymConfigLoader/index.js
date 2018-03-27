const fs = require('fs');
const Q = require('kew');

var SymConfigLoader = {};

SymConfigLoader.loadFromFile = (path) => {

  var defer = Q.defer();

  fs.readFile( path, function (err, data) {
    if (err) {
      defer.reject( err );
    } else {
      var config = JSON.parse(data);
      SymConfigLoader.SymConfig = config;
      defer.resolve( config );
    }
  });

  return defer.promise;;
};

module.exports = SymConfigLoader;
