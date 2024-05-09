const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');
// const config = {
//   server: 'VERMARNCDBG',
//   database: 'tprojone',
//   user: 'udemy',
//   password: 'theUdemyUser',
//   trustServerCertificate: true,
// };

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
router.get('/short', async (req, res) => {
  // const { mode } = req.params;
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute(`getDesignationsShort`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// [id] ,[discpId] ,[description] ,[gradeId]
// int, tinyint, varchar(50), tinyint
// theDesig.id, theDiscp, theDesig.description, theDesig.gradeId
router.post('/', async (req, res) => {
  try {
    // console.log('Hi - Post');
    const { discpId, description, gradeId } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      // .input('id', sql.Int, id)
      .input('discpId', sql.TinyInt, discpId)
      .input('description', sql.VarChar(50), description)
      .input('gradeId', sql.TinyInt, gradeId)
      .execute('postDesignation');

    // res;
    res.status(201).send('New Designation inserted');
  } catch (err) {
    handleError(err, res);
  }
});
// [id] ,[discpId] ,[description] ,[gradeId]
// int, tinyint, varchar(50), tinyint
// theDesig.id, theDiscp, theDesig.description, theDesig.gradeId
router.put('/:id', async (req, res) => {
  // console.log('Hi Put');
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
