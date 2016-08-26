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

    return Houra.initialize(
      require('./fixtures/recipe/index'),
      Path.join(__dirname, 'fixtures', 'app')
    ).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.registrations.vision).to.exist();
      expect(server.bag).to.exist();
      expect(server.bag.get('orm:database:connection:password')).to.equal('toor');
      return server.start().then(() => {

        expect(server._state).to.equal('started');

        return server.inject({url: '/hello'}).then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.payload).to.equal('hello');
        });
      });


    }).catch(error => {
      expect(error).to.not.exist();
    });
  });

  it('Test Houra App with manifest and custom plugin', () => {

    return Houra.initialize(
      require('./fixtures/recipe/index'),
      Path.join(__dirname, 'fixtures', 'app-manifest')
    ).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');
      expect(server.registrations.hapipip).to.exist();
      expect(server.plugins.hapipip).to.exist();
      expect(server.plugins.hapipip.hapipip).to.equal('houra');


      return server.start().then(() => {

        expect(server._state).to.equal('started');

        return server.inject({url: '/mustache'}).then(response => {
          expect(response.statusCode).to.equal(200);
          expect(response.payload).to.equal('hello\n');
        });
      });

    }).catch(error => {
      expect(error).to.not.exist();
    });
  });

  it('Test init Houra with non existent recipe', () => {

    return Houra.initialize(
      'not-a-recipe',
      Path.join(__dirname, 'fixtures', 'app')
    ).then(result => {
      server = result;

      expect(server).to.not.exist();
    }).catch(error => {
      expect(error).to.exist();
      expect(error.message).to.be.equal("Recipe not found : Cannot find module 'not-a-recipe'")
    });
  });

  it('Test init dir error', () => {

    return Houra.initialize(
      require('./fixtures/recipe/index'),
      Path.join(__dirname, 'fixtures', 'app-manifest')
    ).then(result => {
      server = result;

      expect(server).to.be.an.instanceof(Server);
      expect(server._state).to.equal('initialized');

      return server.start().then(() => {

        expect(server._state).to.equal('started');

        expect(Houra.path('unknown')).to.not.exist();

      }).catch(err => {
        expect(err).to.exist();
        expect(err.message).to.be.equal("unknown is undefined into your structure.yml")
      });


    }).catch(error => {
      expect(error).to.not.exist();
      //expect(error.message).to.be.equal("Recipe not found : Cannot find module 'not-a-recipe'")
    });
  });
});
