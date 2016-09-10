'use strict';

exports.register = (server, options, next) => {
  server.expose('hapipip', 'houra');
  next();
};

exports.register.attributes = {
  name: 'hapipip',
  multiple: false
};
