'use strict';

import 'babel-polyfill';
import gm from 'gm';
import Aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';

const s3 = new Aws.S3();

const downloadImage = (params) => {
  return new Promise((resolve, reject) => {
    // const destPath = path.join('/tmp', (new Date()).getTime().toString());
    const destPath = "/test";
    s3.getObject(params).promise()
      .then(data => {
        fs.writeFileSync(destPath, data.Body);
        return resolve(destPath);
      })
      .catch(err => reject(err));
    });
};

export const handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));

  const s3Event = event.Records[0].s3;
  const params = {
    Bucket: s3Event.bucket.name,
    Key: s3Event.object.key,
  };

  Promise.resolve()
    .then(() => downloadImage(params))
    .catch((err) => console.log(err));

  callback(null, event);
};
