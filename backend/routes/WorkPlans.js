const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const handleError = require('../util/handleError');

// used by AddOneStage
router.post('/', async (req, res) => {
  try {
    const { jobId, stageId, depttId, schDtStart, schDtEnd, shareVal } =
      req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .input('stageId', sql.TinyInt, stageId)
      .input('depttId', sql.TinyInt, depttId)
      .input('schDtStart', sql.Date, schDtStart)
      .input('schDtEnd', sql.Date, schDtEnd)
      .input('shareVal', sql.Money, shareVal)
      .execute('postWorkPlan');
    res
      .status(201)
      .send(`WorkPlan data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// used by AddOneStage
router.put('/:jobId/:stageId', async (req, res) => {
  try {
    const { jobId, stageId } = req.params;
    const { depttId, schDtStart, schDtEnd, shareVal } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('jobId', sql.Int, jobId)
      .input('stageId', sql.TinyInt, stageId)
      .input('depttId', sql.TinyInt, depttId)
      .input('schDtStart', sql.Date, schDtStart)
      .input('schDtEnd', sql.Date, schDtEnd)
      .input('shareVal', sql.Money, shareVal)
      .execute('putWorkPlan');
    res
      .status(201)
      .send(`WorkPlan data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
