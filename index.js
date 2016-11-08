import imageResizer from './src/imageResizer';

export const handle = (event, context, callback) => {
  console.log('eventObject: %s', JSON.stringify(event, null, 2));
  console.log('context: %s', JSON.stringify(context, null, 2));

  imageResizer(event.Records[0].s3)
    .then(data => callback(null, data))
    .catch(err => callback(err));
};
