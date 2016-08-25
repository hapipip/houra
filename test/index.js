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

  it('Test Houra in normal conditions', () => {

    return Houra.start(
      require('./fixtures/recipe/index'),
      Path.join(__dirname, 'fixtures', 'app')
    ).then(result => {
      server = result

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('started');
      expect(server.registrations.vision).to.exist();
      expect(server.bag).to.exist();
      expect(server.bag.get('orm:database:connection:password')).to.equal('toor');
      return server.inject({url: '/mustache'}).then(response => {
        expect(response.statusCode).to.equal(200);
        expect(response.payload).to.equal('hello\n');
      });

    }).catch(error => {
      expect(error).to.not.exist();
    });
  });
});
