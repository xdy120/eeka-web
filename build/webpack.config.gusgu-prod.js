const webpackProdConfig = require('./webpack.config.prod.js');
const fs = require('fs');
fs.writeFileSync('./src/config/config.js',
  fs.readFileSync('./src/config/config.gusgu-prod.js'));
module.exports = webpackProdConfig;