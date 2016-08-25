'use strict';
const Path = require('path');

module.exports = () => {
  const Houra = require('./../../../../../../lib/index');
  return {
    plugin: Path.join(Houra.root, 'plugins', 'hapipip')
  }
}
