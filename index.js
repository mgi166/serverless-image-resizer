import url from 'url';
import imageResizer from './src/imageResizer';

const isS3Event = event => typeof event.Records === 'object';
const isApiGatewayEvent = event => typeof event.Records === 'undefined';

const sourceImage = (event) => {
  let bucket = '';
  let key = '';
  let options = {};

  if (isS3Event(event)) {
    const s3 = event.Records[0].s3;
    bucket = s3.bucket.name;
    key = s3.object.key;
  }

  if (isApiGatewayEvent(event)) {
    const u = url.parse(event.queryStringParameters.source_url);
    bucket = u.hostname;
    key = u.path.replace(/^\//, '');
    options = {
      resizeOption: event.queryStringParameters.resize_option,
      destS3Bucket: event.queryStringParameters.dest_s3_bucket,
      destS3Prefix: event.queryStringParameters.dest_s3_prefix,
    };
  }

  return { bucket, key, options };
};

const successResponse = data =>
  // NOTE: lambda proxy integration format
   ({
     isBase64Encoded: false,
     statusCode: 201,
     headers: {
       'Content-Type': 'application/json',
     },
     body: JSON.stringify(data),
   });

export const handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));
  console.log('context: %s', JSON.stringify(context, null, 2));

  const image = sourceImage(event);

  imageResizer({ sourceBucket: image.bucket, sourceKey: image.key, options: image.options })
    .then(data => callback(null, successResponse(data)))
    .catch(err => callback(err));
};
