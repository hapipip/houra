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
    if (server)
      server.stop();
    done()
  });


  it('should reject the promise if no recipe is provided', () => {

    return Houra.start().then(result => {

      server = result;

      expect(server).to.not.exist();

    }).catch(error => {

      expect(error).to.exist();
      expect(error.message).to.equal('"recipe" is required');
    });
  });


  it('should start a hapi server with a default recipe', () => {

    return Houra.start(require('./fixtures/hr-test-fixtures')).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');
      expect(server.connections).length(1);
      expect(server.registrations.good).to.exist();
      expect(server.registrations.cocobag).to.exist();
      expect(server.registrations.vision).to.exist();
      expect(server.registrations.inert).to.exist();
      expect(server.bag).to.exist();
      expect(server.bag.get('test:is')).to.be.true();


    }).catch(error => {

      console.log('ERROR', error.stack)
      expect(error).to.not.exist();
    });
  });

  it('should add a plugin to the default connection', () => {

    return Houra.start(require('./fixtures/hr-test-fixtures'), Path.join(__dirname, 'fixtures', 'test1')).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');
      expect(server.connections).length(1);
      expect(server.registrations.good).to.exist();
      expect(server.registrations.vision).to.exist();
      expect(server.registrations.inert).to.exist();
      expect(server.registrations.dogwater).to.exist();

    }).catch(error => {

      expect(error).to.not.exist();
    });
  });

  it('should override plugins of the default connection', () => {

    return Houra.start(require('./fixtures/hr-test-fixtures'), Path.join(__dirname, 'fixtures', 'test1')).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');
      expect(server.connections).length(1);
      expect(server.registrations.good).to.exist();
      expect(server.registrations.dogwater).to.exist();

    }).catch(error => {
      expect(error).to.not.exist();
    });
  });

  it('should add a connection and correctly bind plugins', () => {

    const args = [
      require('./fixtures/hr-test-fixtures'),
      Path.join(__dirname, 'fixtures', 'test1'),
      Path.join(__dirname, 'fixtures', 'test3'),
      Path.join(__dirname, 'fixtures', 'test4')
    ];

    return Houra.start.apply(Houra, args).then(result => {

      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');
      expect(server.registrations).to.equal(null);

      expect(server.connections).length(2);
      expect(server.connections[0].registrations.good).to.exist();
      expect(server.connections[0].registrations.vision).to.exist();
      expect(server.connections[0].registrations.inert).to.exist();

      expect(server.connections[1].registrations.good).to.exist();
      expect(server.connections[1].registrations.dogwater).to.exist();

    }).catch(error => {

      expect(error).to.not.exist();
    });

  });

});
