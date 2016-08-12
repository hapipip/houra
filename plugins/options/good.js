module exports = (server, next) => {
  server.register({
    register: require('good'),
    options: {
      reporters: {
        console: [
          {
            module: 'good-squeeze',
            name: 'Squeeze',
            args: [{
                response: '*',
                log: '*'
            }]
          },
          {
            module: 'good-console'
          },
          'stdout'
        ]
      }
    }
  }, next);
}
