const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

// fetches theEmpId,theName,theDesig,theGrade,theDiscp,theHrRate,curWorkPlans 
// [emp description at top of booking form]
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

// fetches empId, nameJob, nameStage, dtStart (workPlan), 
// dtEnd (workPlan), wpId, workPlanDepttShare, consumed/booked
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
      .execute('getBookHeads');
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

// to fetch workplan id, remaining value, idx, inError, toUpd
// theBooking, d1 and d2
// d1: days between scheduled start date to booking date
// d2: days between  booking date to scheduled end date
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
    const { empId, workPlanId, dateId, booking, bookingVal } = req.body;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('workPlanId', sql.Int, workPlanId)
      .input('dateId', sql.BigInt, dateId)
      .input('booking', sql.Float, booking)
      .input('bookingVal', sql.Money, bookingVal)
      .execute('postBookings');
    res
      .status(201)
      .send(`Booking data inserted successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

// for Update and Delete
// Deletes when booking = 0
router.put('/', auth, async (req, res) => {
  try {
    const { empId, workPlanId, dateId, booking, bookingVal } = req.body;
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
    res;
    res.send(`Booking data updated successfully ${JSON.stringify(req.body)}`);
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
