const express = require('express');
const router = express.Router();
const config = require('../db/mssqlDb');
const configJwt = require('config');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');


// route for initial testing (do not delete)
// router.get('/', async (req, res) => {
//   try { 
//     const pool = await sql.connect(config);
//     // const result = await pool.request().execute('getEmpsTest');
//     const result = await pool.request().query('select empFullName from emp');
//     res.status(200).json(result.recordset);
//   } catch (err) {
//     handleError(err, res);
//   }
// });

router.get('/',  async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getEmps');
    res.status(200).json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// EmpUpd.jsx
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('id', sql.Int, id)
      .execute(`getOneEmp`);
    res.json(result.recordset);
  } catch (err) {
    handleError(err, res);
  }
});

// Login.jsx
router.get('/:theEMailId/:thePasswd', async (req, res) => {
  try {
    const { theEMailId, thePasswd } = req.params;
    const pool = await sql.connect(config);
    const result = await pool
      .request()
      .input('theEMailId', sql.VarChar(150), theEMailId)
      .execute(`getEmpEmail`);
    // getEmpEmail: eID, eName, eDesigID, eDesig, eGrade, eDepttID, eDeptt, ePass
    if (result.recordset.length == 0) {
      res.status(400).json({
        msg: 'authentication failed',
        token: '',
      });
      return;
    }
    const empFound = await bcrypt.compare(thePasswd, result.recordset[0].ePass);
    if (empFound) {
      const eRec = result.recordset[0];
      delete eRec.ePass;
      const token = jwt.sign(eRec, configJwt.get('jwtPrivateKey'), {
        expiresIn: 600,
      });
      res.json({ msg: 'authenticated successfuly', token: token });
    } else {
      res.status(400).json({
        msg: 'authentication failed',
        token: '',
      });
    }
  } catch (err) {
    handleError(err, res);
  }
});

// ChangePass.jsx
router.put('/cp/:id', auth, async (req, res) => {
  
  try {
    const { id } = req.params;
    const { email, oldPass, passwd } = req.body;
    let pool = await sql.connect(config);
    let result = await pool
      .request()
      .input('theEMailId', sql.VarChar(150), email)
      .execute(`getEmpEmail`);
    if (result.recordset.length == 0) {
      
      return res.status(400).json({ msg: 'Invalid User' });
    }
    const found = await bcrypt.compare(oldPass, result.recordset[0].ePass);
    if (!found) {
      return res.status(400).json({ msg: 'Password did not match' });
    }

    const hashPass = await bcrypt.hash(passwd, 10);
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('passwd', sql.VarChar(150), hashPass)
      .query('UPDATE emp SET passwd = @passwd WHERE id = @id');
    return res.status(200).json({ msg: 'Password Changed' });
  } catch (err) {
    handleError(err, res);
  }
});

// Emps.jsx
router.delete('/:id', auth,async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('id', sql.Int, id)
      .query(`delete emp where id = @id`);
    res.status(200).json({ msg: 'deleted successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

// EmpAdd.jsx
router.post('/', auth, async (req, res) => {
  try {
    const {
      uId,
      fName,
      mName,
      sName,
      title,
      dob,
      gender,
      addLine1,
      cityId,
      mobile,
      eMailId,
      passwd,
    } = req.body;
    const hashPass = await bcrypt.hash(passwd, 10);
    const pool = await sql.connect(config);
    await pool
      .request()
      .input('uId', sql.BigInt, uId)
      .input('fName', sql.VarChar(50), fName)
      .input('mName', sql.VarChar(50), mName)
      .input('sName', sql.VarChar(50), sName)
      .input('title', sql.NChar(3), title)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NChar(1), gender)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('cityId', sql.Int, cityId)
      .input('mobile', sql.BigInt, mobile)
      .input('eMailId', sql.VarChar(150), eMailId)
      .input('passwd', sql.VarChar(150), hashPass)
      .execute('postEmp');
    res.status(200).json({ msg: 'Employee added successfully!' });
  } catch (err) {
   handleError(err, res);
  }
});

// EmpUpd.jsx
router.put('/:id', auth,async (req, res) => {
  try {
    const { id } = req.params;
    const {
      uId,
      fName,
      mName,
      sName,
      title,
      dob,
      gender,
      addLine1,
      cityId,
      mobile,
      eMailId,
      passwd,
    } = req.body;
    const hashPass = await bcrypt.hash(passwd, 10);

    // Create a SQL Server connection pool
    const pool = await sql.connect(config);

    // Update employee data in the Employees table
    await pool
      .request()
      .input('id', sql.Int, id)
      .input('uId', sql.BigInt, uId)
      .input('fName', sql.VarChar(50), fName)
      .input('mName', sql.VarChar(50), mName)
      .input('sName', sql.VarChar(50), sName)
      .input('title', sql.NChar(3), title)
      .input('dob', sql.Date, dob)
      .input('gender', sql.NChar(1), gender)
      .input('addLine1', sql.VarChar(100), addLine1)
      .input('cityId', sql.Int, cityId)
      .input('mobile', sql.BigInt, mobile)
      .input('eMailId', sql.VarChar(150), eMailId)
      .input('passwd', sql.VarChar(150), hashPass)
      .execute('putEmp');

    res.status(200).json({ msg: 'updated successfully!!!' });
  } catch (err) {
    handleError(err, res);
  }
});

module.exports = router;
