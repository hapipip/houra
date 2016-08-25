'use strict';

module.exports = [
  {
    path: '/hello',
    method: 'GET',
    handler: function (request, reply) {
      reply('hello');
    }
  },
  {
    path: '/mustache',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('index');
    }
  }
]
