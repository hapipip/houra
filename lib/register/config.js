'use strict';

module.exports = bag => {
  return {
    register: require('cocobag'),
    options: {
      bag
    }
  };
}
