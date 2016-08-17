'use strict';

module.exports = () => {
  return {
    register: 'dogwater',
    options: {
      adapters: {
        memory: require(Config.orm.adapter)
      },
      connections: {
        simple: { adapter: 'memory' }
      }
    }
  }
}
