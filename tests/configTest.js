'use strict';

const Lab =  require('lab');
const Config = require('../config');
const {expect} = require('code');
const {describe, it, before} = exports.lab = Lab.script();

describe('Test generale config object', () => {
  it ('Load configuration files', (done) => {
    Config.load(__dirname + '/../appTest/config');
    done();
  });

  it ('Test yaml loaded config', (done) => {
    expect(Config.orm.adapter).to.equal('memory');
    done()
  });

  it ('Test json loaded config', (done) => {
    expect(Config.security.roles).to.equal(['TESTER']);
    expect(Config.csrf.activated).to.true();
    done()
  });

  it ('Test rereload config', (done) => {
    try {
      Config.load(__dirname + '/../appTest/config');
    } catch (error) {
      expect(error).to.exist();
      done()
    }
  });
});
