const theConfig = require('config');

const dbConfig = {
  // server: 'SKVERMA',
  server: theConfig.get('theDB'),
  database: 'sern',
  user: 'udemy',
  password: theConfig.get('thePass'),
  trustServerCertificate: true,
};

//PS C:\uproj-three\node> $env:cjisPass="theApiUser"

module.exports = dbConfig;
