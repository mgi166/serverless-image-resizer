'use strict';

import 'babel-polyfill';
import imageResizer from './lib/imageResizer';

export const handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));

  imageResizer(event, context, callback)
    .catch(err => callback(err));
};
