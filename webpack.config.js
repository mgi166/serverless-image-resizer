const nodeExternals = require('webpack-node-externals');
const Dotenv = require('dotenv-webpack');

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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new Dotenv(),
  ],
};
