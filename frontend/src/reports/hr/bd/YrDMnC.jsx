import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { errText } from '../../../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../../home/Spinner';

const YrDMnC = () => {
  const [jSumm, setJSumm] = useState([]);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getJSumm();
  }, []);

  const getJSumm = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(`http://localhost:3000/api/reports/summYDMC`);
      setJSumm(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };
  const clientSumm = (mn) => {
    return jSumm.reduce(
      (accumulator, currentValue) => accumulator + currentValue[mn],
      0
    );
  };
  const bgColor = (theYr) => {
    if (theYr % 2 == 0) {
      return 'lightGray';
    } else {
      return 'lightBlue';
    }
  };

  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <h3 style={{ height: '40px' }}>
        Booking Summary - Year-Department-Month-Wise Bookings across Clients
      </h3>
      <table style={{ border: '1px solid black', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: 'lightcyan' }}>
            <th style={{ border: '1px solid black' }}>Year</th>
            <th style={{ border: '1px solid black' }}>Department</th>
            <th style={{ border: '1px solid black' }}>Month</th>
            <th style={{ border: '1px solid black' }}>ABC</th>
            <th style={{ border: '1px solid black' }}>XYZ</th>
            <th style={{ border: '1px solid black' }}>PQR</th>
            <th style={{ border: '1px solid black' }}>WWQ</th>
            <th style={{ border: '1px solid black' }}>JKW</th>
            <th style={{ border: '1px solid black' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {jSumm.map((t) => {
            return (
              <tr
                key={t.Yr + t.theDeptt + t.Mn}
                style={{ backgroundColor: `${bgColor(t.Yr)}` }}
              >
                <td style={{ border: '1px solid gray' }}>{t.Yr}</td>
                <td style={{ border: '1px solid gray' }}>{t.theDeptt}</td>
                <td style={{ border: '1px solid gray' }}>{t.Mn}</td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.ABC}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.XYZ}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.PQR}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.WWQ}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.JKW}
                </td>

                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  <b>{t.ABC + t.XYZ + t.PQR + t.WWQ + t.JKW}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: 'lightcyan' }}>
            <td>Total</td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>-</td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>-</td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{clientSumm('ABC')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{clientSumm('XYZ')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{clientSumm('PQR')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{clientSumm('WWQ')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{clientSumm('JKW')}</b>
            </td>

            <td style={{ border: '1px solid gray', textAlign: 'right' }}>-</td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default YrDMnC;
