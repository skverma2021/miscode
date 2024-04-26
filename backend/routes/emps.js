const express = require('express');
const router = express.Router();
const config = require('../db/mssqlDb');
const configJwt = require('config');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const handleError = require('../util/handleError');

router.get('/', async (req, res) => {

  try {
    
    const pool = await sql.connect(config);
    const result = await pool.request().execute('getEmpsTest');
    res.status(200).json(result.recordset);
  } catch (err) {

    handleError(err, res);
  }
});

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

const isOK = async (clearPass, hashPass) => {
  try {
    // const hash = await bcrypt.hash(clearPass, 10);
    const match = await bcrypt.compare(clearPass, hashPass);
    return match;
  } catch (error) {}
};

router.get('/:theEMailId/:thePasswd', async (req, res) => {
  try {
    const { theEMailId, thePasswd } = req.params;
    const pool = await sql.connect(config);

    const result = await pool
      .request()
      .input('theEMailId', sql.VarChar(150), theEMailId)
      .execute(`getEmpEmail`);
    if (result.recordset.length == 0) {
      res.status(400).json({
        msg: 'authentication failed',
        token: '',
      });
      return;
    }
    const empFound = await isOK(thePasswd, result.recordset[0].ePass);
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
    const found = await isOK(oldPass, result.recordset[0].ePass);
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

module.exports = router;
