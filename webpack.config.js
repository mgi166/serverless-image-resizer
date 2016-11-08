const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: [
    'babel-polyfill',
    './index.js',
  ],
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'index.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  externals: [nodeExternals()],
};
