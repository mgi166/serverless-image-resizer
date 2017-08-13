import imageResizer from './src/imageResizer';
import url from 'url';

export const handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));
  console.log('context: %s', JSON.stringify(context, null, 2));

  const image = sourceImage(event);

  imageResizer({sourceBucket: image.bucket, sourceKey: image.key})
    .then(data => callback(null, data))
    .catch(err => callback(err));
};

const sourceImage = (event) => {
  let bucket = '';
  let key = '';

  if (isS3Event(event)) {
    const s3 = event.Records[0].s3;
    bucket = s3.bucket.name;
    key = s3.object.key;
  }

  if (isApiGatewayEvent(event)) {
    const u = url.parse(event.queryStringParameters.source_url);
    bucket = u.hostname;
    key = u.path.replace(/^\//, "");
  }

  return { bucket: bucket, key: key };
};

const isS3Event = (event) => {
  return typeof event.Records === 'object';
};

const isApiGatewayEvent = (event) => {
  return typeof event.Records === 'undefined';
};
