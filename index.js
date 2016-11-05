'use strict';

import 'babel-polyfill';
import gm from 'gm';

module.exports.handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));
  callback(null, event);
};
