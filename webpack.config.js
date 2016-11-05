const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './index.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs',
    path: '.webpack',
    filename: 'index.js'
  },
  externals: [nodeExternals()]
};
