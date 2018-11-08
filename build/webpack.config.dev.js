const webpack = require('webpack');
const merge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackBaseConfig = require('./webpack.config.base.js');
const fs = require('fs');

fs.writeFileSync('./src/config/config.js',
  fs.readFileSync('./src/config/config.dev.js'));

module.exports = merge(webpackBaseConfig, {
  devtool: '#eval-source-map',
  output: {
    publicPath: '/',
    filename: '[name].js',
    chunkFilename: '[name].chunk.js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].css',
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: './index.html',
      template: './src/index.ejs'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"'
      }
    })
  ],
  devServer: {
    contentBase: './',
    open: true,
    inline: true,
    compress: true,
    historyApiFallback: true
  }
});