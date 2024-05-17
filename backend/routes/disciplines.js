const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');


// ContextDesig.jsx, Desig.jsx, Disciplines.jsx
router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .query('select id, description from discipline order by description');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
