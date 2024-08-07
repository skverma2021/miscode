const express = require('express');
const config = require('config');
const cors = require('cors');
const app = express();

// HR routes
const emps = require('./routes/emps');
const cities = require('./routes/cities');
const disciplines = require('./routes/disciplines');
const designations = require('./routes/designation');
const grades = require('./routes/grades');
const tp = require('./routes/tp');
const departments = require('./routes/departments')

// BD routes
const clients = require('./routes/clients');
const jobs = require('./routes/jobs');
const workplans = require('./routes/WorkPlans');

// Bookings related
const bookings = require('./routes/bookings');

// Reports related
const reports = require('./routes/reports');


//  Set database password on the command line
//  $env:cjisPass="cdcbgt"

//  Set jsonwebtoken private key on the command line
//  $env:cjisJwtPvtKey="xxxyyyzzz"

//  Set Database  on the command line
//  $env:dbName="SKVERMA"
//  $env:dbName="VERMARNCDBG"

//  Set the environment - development or production on the command line
//  default is development
//  $env:NODE_ENV="development"
//  $env:NODE_ENV="production"

//  Enable all CORS requests

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HR begin
app.use('/api/emps', emps);
app.use('/api/cities', cities);
app.use('/api/disciplines', disciplines);
app.use('/api/designations', designations);
app.use('/api/grades', grades);
app.use('/api/tp', tp);
app.use('/api/departments', departments);

// BD begin
app.use('/api/clients', clients);
app.use('/api/jobs', jobs);
app.use('/api/workplans', workplans);

// Bookings
app.use('/api/bookings', bookings)

// Reports
app.use('/api/reports', reports)

app.listen(config.get('thePort'), () =>
  console.log(
    `The server started running the API [${config.get(
      'appName'
    )}] on port: ${config.get('thePort')} in ${app.get('env')} environment`
  )
);
