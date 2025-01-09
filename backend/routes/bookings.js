const express = require('express');
const router = express.Router();
const sql = require('mssql');
const config = require('../db/mssqlDb');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');


// fetches job description, workplan description, shareVal, usedVal, 
// and schedule for the month and year
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

// fetches all rows (id, theDay and weekDay) from allDays table for the month and year
// the fetched column (theDay) becomes the row header of the booking sheet 
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

// to fetch workplan id, theBooking, inError, toEdit, toUpd, and hasChanged
// inError, toEdit, toUpd, and hasChanged are flags to control the booking form
router.get('/:empId/:dtId', auth, async (req, res) => {
  try {
    const { empId, dtId} = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('empId', sql.Int, empId)
      .input('dtId', sql.BigInt, dtId)
      .execute('getBookings');

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
// It deletes when booking = 0
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
