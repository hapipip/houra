'use strict';

const Uhu = require('uhu');
const Joi = require('joi');
const Path = require('path');
const Glue = require('glue');

const internals = {};

internals.manifestMask = {
  server: true,
  connections: true,
  registrations: true
};

internals.logger = {
  register: require('good'),
  options: {
    ops: {
      interval: 1000
    },
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{ request: "*", log: "*", response: "*", error: "*"}]
      }, {
        module: 'good-console'
      }, 'stdout']
      // file: [{
      //   module: 'good-squeeze',
      //   name: 'Squeeze',
      //   args: [{ ops: '*' }]
      // }, {
      //   module: 'good-squeeze',
      //   name: 'SafeJson'
      // }, {
      //   module: 'good-file',
      //   args: ['./test/fixtures/awesome_log']
      // }],
      // http: [{
      //   module: 'good-squeeze',
      //   name: 'Squeeze',
      //   args: [{ error: '*' }]
      // }, {
      //   module: 'good-http',
      //   args: ['http://prod.logs:3000', {
      //     wreck: {
      //       headers: { 'x-api-key': 12345 }
      //     }
      //   }]
      // }]
    }
  }
  // opsInterval: 1000,
  // requestPayload: true,
  // responsePayload: true,
  // reporters: {
  //   console: [{
  //     module: 'good-console',
  //     args: [{"request": "*", "log": "*", "response": "*", "error": "*"}]
  //   }]
  // }

};

internals.extractValues = object => {
  Joi.assert(object, Joi.object().required().label('object'));
  return Object.keys(object).map(key => object[key]);
};

internals.Houra = module.exports = {};

internals.Houra.initialize = (...paths) => {

  paths.unshift(Path.join(__dirname, 'config'));
  const manifest = Uhu.stick(paths, {
    sanitize: internals.manifestMask
  });

  if (!Array.isArray(manifest.registrations))
    manifest.registrations = internals.extractValues(manifest.registrations);

  if (!Array.isArray(manifest.connections))
    manifest.connections = internals.extractValues(manifest.connections);

  //manifest.server.connections.routes.files = {relativeTo: __dirname+'/static'};

  return Glue.compose(manifest, {
    //relativeTo: __dirname+'/modules',
    preRegister: function (server, next) {
      server.register(internals.logger, next);
    }
  }).then(server => {
    return server.initialize().then(() => server)
  });

  //, function (err, server) {
  //  Hoek.assert(!err, err);
  //
  //  server.views({
  //    engines: { jade: require('jade') },
  //    path: __dirname + '/views',
  //    compileOptions: {
  //      pretty: true
  //    }
  //  });
  //return server.initialize();
  //function (err) {
  //  Hoek.assert(!err, err);
  //
  //  done(server);
  //});
  //});
};
