'use strict';

import Aws from 'aws-sdk';
import path from 'path';
import fs from 'fs';
import ulid from 'ulid';

const gm = require('gm').subClass({ imageMagick: true });
const s3 = new Aws.S3();

const downloadImage = (params) => {
  return new Promise((resolve, reject) => {
    console.log('downloadImage start...');
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
    console.log('imageInfo start...');
    gm(imagePath)
      .identify((err, info) => {
        if (err) return reject(err);
        console.log('Source image info: %j', info);
        return resolve(info);
      });
  });
};

const resizeImage = (imagePath, info) => {
  return new Promise((resolve, reject) => {
    console.log('resizeImage start...');
    const resizeOpts = /^(\d+)x(\d+)([%@!<>])?$/g.exec(process.env.RESIZE_OPTION);

    gm(imagePath)
      .resize(resizeOpts[1], resizeOpts[2], resizeOpts[3])
      .toBuffer(info.format, (err, buffer) => {
        return err ? reject(err) : resolve(buffer);
      });
  });
};

const uploadImage = (buffer, info) => {
  return new Promise((resolve, reject) => {
    console.log('uploadImage start...');
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

export default async (event, context, callback) => {
  const s3Event = event.Records[0].s3;
  const params = {
    Bucket: s3Event.bucket.name,
    Key: s3Event.object.key,
  };

  const imagePath = await downloadImage(params);
  const info = await imageInfo(imagePath);
  const imageBuffer = await resizeImage(imagePath, info);
  const result = await uploadImage(imageBuffer, info);
  callback(null, result);
};

