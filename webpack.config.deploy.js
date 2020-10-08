/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

// import * as path from 'path';
// import * as slsw from 'serverless-webpack';
// import * as nodeExternals from 'webpack-node-externals';

const entries = {};
Object.keys(slsw.lib.entries).forEach(
  key =>
    (entries[key] = [
      slsw.lib.entries[key],
    ]),
);

module.exports = {
  // entry: entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  devtool: 'source-map',
  resolve: {
    extensions: ['.mjs', '.js', '.jsx', '.json', '.ts', '.tsx']
  },
  externals: [nodeExternals()],
  module: {
    rules: [
      { test: /\.tsx?$/, loader: 'ts-loader' },
      {
        type: 'javascript/auto',
        test: /\.mjs$/,
        use: [],
      },
    ],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, 'dist/app'),
    filename: '[name].js',
    sourceMapFilename: '[file].map' },
};
