const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

// ContextDesigList.jsx, DesigList.jsx, Disciplines.jsx
router.get('/long/:discpId', async (req, res) => {
  try {
    const { discpId } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('discpId', sql.TinyInt, discpId)
      .execute('getDesignations');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// used by Posting.jsx
router.get('/short', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`getDesignationsShort`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
router.get('/select', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`desigSelect`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// ContextDesigEdit.jsx, DesigEdit.jsx, Disciplines.jsx
// [id] ,[discpId] ,[description] ,[gradeId]
// int, tinyint, varchar(50), tinyint
// theDesig.id, theDiscp, theDesig.description, theDesig.gradeId
router.post('/', async (req, res) => {
  try {
    const { discpId, description, gradeId } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('discpId', sql.TinyInt, discpId)
      .input('description', sql.VarChar(50), description)
      .input('gradeId', sql.TinyInt, gradeId)
      .execute('postDesignation');
    res.status(201).send('New Designation inserted');
  } catch (err) {
    handleError(err, res);
  }
});

// ContextDesigEdit.jsx, DesigEdit.jsx, Disciplines.jsx
// [id] ,[discpId] ,[description] ,[gradeId]
// int, tinyint, varchar(50), tinyint
// theDesig.id, theDiscp, theDesig.description, theDesig.gradeId
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { discpId, description, gradeId } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('discpId', sql.TinyInt, discpId)
      .input('description', sql.VarChar(50), description)
      .input('gradeId', sql.TinyInt, gradeId)
      .execute('putDesignation');
    res.status(201).send('Designation updated');
  } catch (err) {
    handleError(err, res);
  }
});

// ContextDesigList.jsx, DesigList.jsx, Disciplines.jsx
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM designation WHERE id = @id');
    res.status(200).send('Record deleted successfully');
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
