const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const handleError = require('../util/handleError');

// used by AddOneStage
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getDepartments');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// used by Transfer.jsx
router.get('/short', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`getDepartmentsShort`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
router.get('/select', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`[depttSelect]`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
