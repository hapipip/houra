
const Hoek = require('hoek');
const Houra = require('./lib');

Houra.initialize().then(server => {
  server.start(function (err) {
    Hoek.assert(!err, err);

    server.connections.forEach(function (connection) {
      server.log(['info', 'start'], "Server started at " + connection.info.uri)
    });

  });
});