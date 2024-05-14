const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getAllJobs');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// // POST route to insert job data
router.post('/', auth, async (req, res) => {
  try {
    const { description, clientId, ordDateStart, ordDateEnd, ordValue } =
      req.body;
    console.log(description, clientId, ordDateStart, ordDateEnd, ordValue);

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    await pool
      .request()
      .input('description', sql.VarChar(100), description)
      .input('clientId', sql.Int, clientId)
      .input('ordDateStart', sql.Date, ordDateStart)
      .input('ordDateEnd', sql.Date, ordDateEnd)
      .input('ordValue', sql.Money, ordValue)
      .execute('postJob');
    res
      .status(201)
      .send(`Job data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// // PUT route to insert city data
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { description, clientId, ordDateStart, ordDateEnd, ordValue } =
      req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('description', sql.VarChar(100), description)
      .input('clientId', sql.Int, clientId)
      .input('ordDateStart', sql.Date, ordDateStart)
      .input('ordDateEnd', sql.Date, ordDateEnd)
      .input('ordValue', sql.Money, ordValue)
      .execute('putJob');

    res
      .status(201)
      .send(`Job data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// // DELETE route to delete a record from the Job table
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool.request().input('id', sql.Int, id).execute('delJobById');
    res.send('Record deleted successfully');
  } catch (err) {
    handleError(err, res);
  }
});

// // GET one Job 
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .execute('getJobById');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// used in JobExPlanAdd to get JobInfo alongwith Client
// used in JobExPlan to get JobInfo alongwith Client

router.get('/client/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .execute(`getJobWithClient`);
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
// used in JobExPlanAdd
router.get('/exStages/:jobId', async (req, res) => {
  try {
    const { jobId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .execute('getJobExStages');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
module.exports = router;
