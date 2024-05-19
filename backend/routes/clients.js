// const { validate } = require('../models/client');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const handleError = require('../util/handleError');

router.get('/', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getClients');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

router.get('/short', async (req, res) => {
  try {
    const { mode } = req.params;
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getClientsShort');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// POST route to insert city data
router.post('/', async (req, res) => {
  try {
    const {
      shortName,
      longName,
      website,
      contactName,
      contactEMail,
      contactMobile,
      addLine1,
      street,
      cityId,
    } = req.body;
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('shortName', sql.NChar(10), shortName)
      .input('longName', sql.VarChar(100), longName)
      .input('website', sql.VarChar(100), website)
      .input('contactName', sql.VarChar(50), contactName)
      .input('contactEMail', sql.VarChar(100), contactEMail)
      .input('contactMobile', sql.BigInt, contactMobile)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('street', sql.VarChar(50), street)
      .input('cityId', sql.Int, cityId)
      .execute('postClient');
    res
      .status(201)
      .send(`client data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// POST route to insert city data
router.put('/:id', async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);
    const { id } = req.params;
    const {
      shortName,
      longName,
      website,
      contactName,
      contactEMail,
      contactMobile,
      addLine1,
      street,
      cityId,
    } = req.body;

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('shortName', sql.NChar(10), shortName)
      .input('longName', sql.VarChar(100), longName)
      .input('website', sql.VarChar(100), website)
      .input('contactName', sql.VarChar(50), contactName)
      .input('contactEMail', sql.VarChar(100), contactEMail)
      .input('contactMobile', sql.BigInt, contactMobile)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('street', sql.VarChar(50), street)
      .input('cityId', sql.Int, cityId)
      .execute('putClient');

    res
      .status(201)
      .send(`client data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// DELETE route to delete a record from the client table
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query('DELETE FROM client WHERE id = @id');

    res.status(200).send('Record deleted successfully');
  } catch (err) {
    handleError(err, res);
  }
});

// GET one Client
router.get('/:id', async (req, res) => {
  // console.log('Here');
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM client where id = @id');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
