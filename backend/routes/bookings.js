// const { validate } = require('../models/emp');
const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

// fetches theEmpId,theName,theDesig,theGrade,theDiscp,theHrRate,curWorkPlans [emp description at top of booking form]
router.get('/empheader/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .execute('getEmpBookHeads');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// fetches empId, nameJob, nameStage, dtStart (workPlan), dtEnd (workPlan), wpId, workPlanDepttShare, consumed/booked
// selected workPlans of department where start and finish overlap with the month
// fetched columns act as helptext and become column head for booking form
router.get('/bookheader/:id/:m/:y', auth, async (req, res) => {
  try {
    const { id, m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookHeads1');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});
// fetches id, theDay and weekDay from allDays table
// the fetched column (theDay) becomes the first column of the booking sheet for the month

router.get('/bookdates/:m/:y', auth, async (req, res) => {
  try {
    const { m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('m', sql.Int, m)
      .input('y', sql.Int, y)
      .execute('getBookingDates');
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

router.get('/:empId/:dtId', auth, async (req, res) => {
  try {
    const { empId, dtId, m, y } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('dtId', sql.BigInt, dtId)
      .execute('getBookings1');

    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// POST route to insert booking data
router.post('/', auth, async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, workPlanId, dateId, booking, bookingVal } = req.body;

    // console.log('POST:', empId, workPlanId, dateId, booking);
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Insert booking data into the bookings table
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('workPlanId', sql.Int, workPlanId)
      .input('dateId', sql.BigInt, dateId)
      .input('booking', sql.Float, booking)
      .input('bookingVal', sql.Money, bookingVal)
      .execute('postBookings');

    // res;
    res
      .status(201)
      .send(`Booking data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});
// PUT/DELETE route to insert booking data (DELETES when booking = 0)
router.put('/', auth, async (req, res) => {
  try {
    // const { error } = validate(req.body);
    // if (error)
    //   return res.status(400).send(`Invalid input: ${error.details[0].message}`);

    const { empId, workPlanId, dateId, booking, bookingVal } = req.body;

    // console.log('PUT:', empId, workPlanId, dateId, booking);
    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    if (booking == 0) {
      await pool
        .request()
        .input('empId', sql.Int, empId)
        .input('workPlanId', sql.Int, workPlanId)
        .input('dateId', sql.BigInt, dateId)
        .query(
          'delete bookings where empId = @empId and workPlanId = @workPlanId and dateId = @dateId'
        );
    } else {
      await pool
        .request()
        .input('empId', sql.Int, empId)
        .input('workPlanId', sql.Int, workPlanId)
        .input('dateId', sql.BigInt, dateId)
        .input('booking', sql.Float, booking)
        .input('bookingVal', sql.Money, bookingVal)
        .execute('putBookings');
    }

    // Insert booking data into the bookings table

    res;
    res.send(`Booking data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
