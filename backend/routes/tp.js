const express = require('express');
const router = express.Router();
const config = require('../db/mssqlDb');
const sql = require('mssql');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

// used by TransferPosting.jsx, 
router.get('/empheader/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .execute('getEmpHeader');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// PostingTrail.jsx
router.get('/empDesig/:empId', async (req, res) => {
  const { empId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .execute(`getEmpDesigTrail`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// TransferTrail.jsx
router.get('/empdeptt/:empId', async (req, res) => {
  const { empId } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .execute(`getEmpDepttTrail`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Posting.jsx
router.post('/empdesig', async (req, res) => {
  try {
    const { empId, desigId, fromDt } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('desigId', sql.Int, desigId)
      .input('fromDt', sql.Date, fromDt)
      .execute('postEmpDesig');
    res.status(200).json({ msg: 'empDesig added successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// Transfer.jsx
router.post('/empdeptt', async (req, res) => {
  try {
    const { empId, depttId, fromDt } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('depttId', sql.Int, depttId)
      .input('fromDt', sql.Date, fromDt)
      .execute('postEmpDeptt');
    res.status(200).json({ msg: 'empDeptt added successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// Posting.jsx
router.put('/empDesig/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { empId, desigId, fromDt } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('empId', sql.Int, empId)
      .input('desigId', sql.Int, desigId)
      .input('fromDt', sql.Date, fromDt)
      .execute('putEmpDesig');
    res.status(200).json({ msg: 'updated successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// Transfer.jsx
router.put('/empdeptt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { empId, depttId, fromDt } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('empId', sql.Int, empId)
      .input('depttId', sql.Int, depttId)
      .input('fromDt', sql.Date, fromDt)
      .execute('putEmpDeptt');

    res.status(200).json({ msg: 'updated successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// PostingTrail.jsx
router.delete('/empDesig/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM empDesig WHERE id = @id');
    res.status(200).json({ msg: 'deleted successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// TransferTrail.jsx
router.delete('/empdeptt/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM empDeptt WHERE id = @id');

    res.status(200).json({ msg: 'deleted successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
