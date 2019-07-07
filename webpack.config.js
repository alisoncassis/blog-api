const webpack = require('webpack')

module.exports = {
  mode: 'development',
  plugins: [new webpack.DefinePlugin({ 'process.env': require('./.env.js') })]
}
