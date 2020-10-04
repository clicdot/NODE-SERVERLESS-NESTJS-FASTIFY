
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
      // './source-map-install.js',
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
      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   use: [
      //     {
      //       loader: 'babel-loader',
      //     },
      //   ],
      // },
      // {
      //   test: /\.(graphql|gql)$/,
      //   exclude: /node_modules/,
      //   loader: 'graphql-tag/loader',
      // },
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
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
