const express = require('express');
const config = require('config');
const cors = require('cors');
const app = express();

const emps = require('./routes/emps');

//  Set PORT on the command line
//  $env:cjisPort="7000"

//  Set database password on the command line
//  $env:cjisPass="theUdemyUser"

//  Set jsonwebtoken private key on the command line
//  $env:cjisJwtPvtKey="xxxyyyzzz"

//  Set the environment - development or production on the command line
//  default is development
//  $env:NODE_ENV="production"

// Enable all CORS requests
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/emps', emps);

// const PORT = process.env.PORT || config.get('thePort');
const PORT = config.get('thePort');

app.listen(PORT, () =>
  console.log(
    `The server started running the API [${config.get(
      'appName'
    )}]  on port: ${PORT} in ${app.get('env')} environment`
  )
);
