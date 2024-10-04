const express = require('express');
const router = express.Router();
const config = require('../db/mssqlDb');
const sql = require('mssql');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');


// Employees Summary - Departments X Grades
router.get('/summDG', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabDepttGradeEmpCount');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Employees Summary - Departments X AgeGroups
router.get('/summDA', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabDepttEmpAgeGroup');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Booking Summary - Year X Months
router.get('/summYM', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xYearMonthBooked');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Booking Summary - Year/Departments X Months
router.get('/summYDM', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xYearDepttMonthBooked');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Booking Summary - Year/Departments/Months X Clients
router.get('/summYDMC', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xYearDepttMonthClientBooked');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Allotment Summary - Year/Departments X Months
router.get('/summYDMA', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('xTabShareVal1');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
