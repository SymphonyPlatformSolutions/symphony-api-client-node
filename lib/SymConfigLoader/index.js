const fs = require('fs');
const Q = require('kew');

var SymConfigLoader = {};

SymConfigLoader.loadFromFile = (path) => {

  var defer = Q.defer();

  fs.readFile( __dirname + path, function (err, data) {
    if (err) {
      defer.reject( err );
    } else {
      defer.resolve( JSON.parse(data) );
    }
  });

  return defer.promise;;
};

module.exports = SymConfigLoader;
