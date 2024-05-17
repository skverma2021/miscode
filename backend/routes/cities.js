const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const handleError = require('../util/handleError');

// Used by EmpUpd.jsx, EmpAdd.jsx
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT * FROM cities');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
