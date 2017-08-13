# serverless-image-resizer
Resize image by AWS Lambda

## Features

* Use [Serverless Framework](https://github.com/serverless/serverless#features)
* The image conversion by event of s3 object created
* The image conversion endpoint by API Gateway

### The image conversion by event of s3 object created

* You upload an image file to `s3://${SOURCE_S3_BUCKET_NAME}/${SOURCE_S3_PREFIX}/xxxx.png`.
* S3 create object-created event. and invoke AWS Lambda function.
* Downloads raw image file from s3 in AWS Lambda.
* Resize the image with ImageMagick(using [gm](https://github.com/aheckmann/gm))
* Uploads the resized image file to `s3://${DEST_S3_BUCKET_NAME}/${DEST_S3_PREFIX}/{26 random chars}.{png|jpg|gif|...}` in AWS Lambda.

### The image conversion endpoint by API Gateway

Create converted image.

#### URL

* `https://{random}.execute-api.{region}.amazonaws.com/{stages}/api/v1.0/resized_image`
  * `{random}`
    * Random string determinated by serverless.
  * `{region}`
    * Region of AWS
  * `{stages}`
    * Stages of API Gateway deployed by serverless.

#### Method

`POST`

#### Request
##### Headers

None.

##### Parameters

|Name|Type|Required|Detail|Example|
|---|---|---|---|---|
|`source_url`| string | true | URL of source image. | `s3://examples.com/image.png` |
|`resize_option`| string | false | Resize option by imagemagick. See [Resizing or Scaling -- IM v6 Examples](http://www.imagemagick.org/Usage/resize/#resize) | `800x600` |
|`dest_s3_bucket`| string | false | Destination of s3 bucket name | `upload-resized-image-bucket` |
|`dest_s3_prefix`| string | false | Destination of s3 prefix | `upload` |

#### Response
##### Headers

|Key|Value|
|---|---|
|`Content-Type`|`application/json`|

##### Body

```
{
  "ETag": "\"a2aeedc65cb3a9398a74801401092c8c\"",
  "Location": "https://example-bucket.s3-ap-northeast-1.amazonaws.com/result/01BQCS8J09S1W7VBWCPZ1Z5Z3X.jpeg",
  "key": "result/01BQCS8J09S1W7VBWCPZ1Z5Z3X.jpeg",
  "Key": "result/01BQCS8J09S1W7VBWCPZ1Z5Z3X.jpeg",
  "Bucket": "example-bucket"
}
```

## Required

* [nodejs/node](https://github.com/nodejs/node)
  * `> v6.0.0`
* [yarn](https://github.com/yarnpkg/yarn)

## Getting started

```
% git clone https://github.com/mgi166/serverless-image-resizer.git
% yarn install

% export AWS_ACCESS_KEY_ID=<Your AWS_ACCESS_KEY_ID>
% export AWS_SECRET_ACCESS_KEY=<your AWS_SECRET_ACCESS_KEY>
% export AWS_REGION=<Your AWS_REGION>
% export SOURCE_S3_BUCKET_NAME=<Your s3 bucket name as upload destination of raw image>
% export SOURCE_S3_PREFIX=<prefix of key that has raw image>
% export DEST_S3_BUCKET_NAME=<Your s3 bucket name as upload destination of converted image>
% export DEST_S3_PREFIX=<prefix of key that has converted image>

% yarn deploy

# Upload image and start to convert image
% yarn upload_source_image
```

## Commands

### Execute AWS Lambda function from s3 object-created event

```
yarn upload_source_image
```

### Invoke AWS Lambda function

```
yarn invoke
```

### Local invoking AWS Lambda function

```
yarn invoke:local
```

### Viewing log output

```
yarn logs
```

## Environment variables

All environment variables required.

* `AWS_REGION`
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
* `SOURCE_S3_BUCKET_NAME`
* `SOURCE_S3_PREFIX`
* `RESIZE_OPTION`
   * e.g. `600x600` or `400x600!` or `100x100^`...
   * See the reference. [Resizing or Scaling -- IM v6 Examples](http://www.imagemagick.org/Usage/resize/#resize)
* `DEST_S3_BUCKET_NAME`
* `DEST_S3_PREFIX`

## Contributing

1. Fork it ( https://github.com/mgi166/serverless-image-resizer/fork )
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create a new Pull Request
