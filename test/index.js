'use strict';

const Lab =  require('lab');
const Houra = require('../lib');
const Path = require('path');
const Server = require('hapi/lib/server');
const {expect} = require('code');
const {describe, it, afterEach} = exports.lab = Lab.script();


describe('Houra.initialize', () => {
  let server;

  afterEach(done => {
    server.stop();
    done()
  });

  it ('Initialize and start a hapi server with default configuration', () => {

    return Houra.initialize().then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.connections).length(1);
      expect(server.bag).to.exist();
      expect(server.registrations.good).to.exist();
      expect(server.registrations.vision).to.exist();
      expect(server.registrations.inert).to.exist();

      return server.start().then(() => {

        expect(server._state).to.equal('started');
      });

    }).catch(error => {

      expect(error).to.not.exist();
    });
  });


  it ('should add one plugin to the default connection', () => {

    return Houra.initialize(Path.join(__dirname, 'fixtures', 'test1')).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.connections).length(1);
      expect(server.registrations.good).to.exist();
      expect(server.registrations.vision).to.exist();
      expect(server.registrations.inert).to.exist();
      expect(server.registrations.dogwater).to.exist();

      return server.start().then(() => {
        expect(server._state).to.equal('started');
      });

    }).catch(error => {

      expect(error).to.not.exist();
    });
  });

  it ('should override plugins of the default connection', () => {

    return Houra.initialize(Path.join(__dirname, 'fixtures', 'test1')).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.connections).length(1);
      expect(server.registrations.good).to.exist();
      expect(server.registrations.dogwater).to.exist();

      return server.start().then(() => {
        expect(server._state).to.equal('started');
      })
    }).catch(error => {
      expect(error).to.not.exist();
    });
  });




  it ('should add a connection and correctly bind plugins', () => {

    const paths = [
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test3'),
      Path.join(__dirname, 'fixtures', 'test4')
    ];

    return Houra.initialize.apply(Houra, paths).then(result => {
      //return Houra.initialize(Path.join(__dirname, 'fixtures', 'test1')).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.registrations).to.equal(null);

      expect(server.connections).length(2);
      expect(server.connections[0].registrations.good).to.exist();
      expect(server.connections[0].registrations.vision).to.exist();
      expect(server.connections[0].registrations.inert).to.exist();

      expect(server.connections[1].registrations.good).to.exist();
      expect(server.connections[1].registrations.dogwater).to.exist();

      return server.start().then(() => {
        expect(server._state).to.equal('started');
      });

    }).catch(error => {

      expect(error).to.not.exist();
    });

  });

});
