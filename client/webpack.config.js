const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/game.js',
  output: {
    path: path.resolve(__dirname, '../public'),
    filename: 'bundle.[contenthash].js'
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['**/*', '!*.css']
    })
  ]
};
