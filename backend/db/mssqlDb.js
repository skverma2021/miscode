const theConfig = require('config');

const config = {
  server: 'SKVERMA',
  database: 'sern',
  user: 'udemy',
  password: theConfig.get('thePass'),
  trustServerCertificate: true,
};

//PS C:\uproj-three\node> $env:cjisPass="theApiUser"

module.exports = config;
