'use strict';

import 'babel-polyfill';
import Aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import ulid from 'ulid';

const gm = require('gm').subClass({ imageMagick: true });
const s3 = new Aws.S3();

const downloadImage = (params) => {
  return new Promise((resolve, reject) => {
    const destPath = path.join('/tmp', (new Date()).getTime().toString());
    s3.getObject(params).promise()
      .then(data => {
        fs.writeFileSync(destPath, data.Body);
        return resolve(destPath);
      })
      .catch(err => reject(err));
    });
};

const imageInfo = (imagePath) => {
  return new Promise((resolve, reject) => {
    gm(imagePath)
      .identify((err, info) => {
        return err ? reject(err) : resolve(info);
      });
  });
};

const resizeImage = (imagePath) => {
  return new Promise((resolve, reject) => {
    const resizeOpts = /^(\d+)x(\d+)([%@!<>])?$/g.exec(process.env.RESIZE_OPTION);

    gm(imagePath)
      .resize(resizeOpts[1], resizeOpts[2], resizeOpts[3])
      .toBuffer('png', (err, buffer) => {
        return err ? reject(err) : resolve(buffer);
      });
  });
};

const uploadImage = (buffer, info) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: process.env.DEST_S3_BUCKET_NAME,
      Key: `${process.env.DEST_S3_PREFIX}/${ulid()}.${info.format}`,
      Body: buffer,
      ContentType: info['Mime type'],
    };

    s3.upload(params, (err, data) => {
      return err ? reject(err) : resolve(data);
    });
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
