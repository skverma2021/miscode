const express = require('express');
const router = express.Router();
const config = require('../db/mssqlDb');
const configJwt = require('config');
const sql = require('mssql');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');



router.get('/summDG', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabDepttGradeEmpCount');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
router.get('/summDA', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabDepttEmpAgeGroup');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
