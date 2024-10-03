import React from 'react';
import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { errText } from '../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';

const YrDMnA = () => {
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
      const res = await axios.get(`http://localhost:3000/api/reports/summYDMA`);
      setJSumm(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };
  const monthSumm = (mn) => {
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
        Allotment Summary - Year-wise Department's Allottment of Money across
        Months
      </h3>
      <table style={{ border: '1px solid black', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: 'lightcyan' }}>
            <th style={{ border: '1px solid black' }}>Year</th>
            <th style={{ border: '1px solid black' }}>Department</th>
            <th style={{ border: '1px solid black' }}>January</th>
            <th style={{ border: '1px solid black' }}>February</th>
            <th style={{ border: '1px solid black' }}>March</th>
            <th style={{ border: '1px solid black' }}>April</th>
            <th style={{ border: '1px solid black' }}>May</th>
            <th style={{ border: '1px solid black' }}>June</th>
            <th style={{ border: '1px solid black' }}>July</th>
            <th style={{ border: '1px solid black' }}>August</th>
            <th style={{ border: '1px solid black' }}>September</th>
            <th style={{ border: '1px solid black' }}>October</th>
            <th style={{ border: '1px solid black' }}>November</th>
            <th style={{ border: '1px solid black' }}>December</th>
            <th style={{ border: '1px solid black' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {jSumm.map((t) => {
            return (
              <tr
                key={t.yr + t.theDeptt}
                style={{ backgroundColor: `${bgColor(t.yr)}` }}
              >
                <td style={{ border: '1px solid gray' }}>{t.yr}</td>
                <td style={{ border: '1px solid gray' }}>{t.theDeptt}</td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.January}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.February}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.March}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.April}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.May}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.June}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.July}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.August}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.September}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.October}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.November}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  {t.December}
                </td>

                <td style={{ border: '1px solid gray', textAlign: 'right' }}>
                  <b>
                    {t.January +
                      t.February +
                      t.March +
                      t.April +
                      t.May +
                      t.June +
                      t.July +
                      t.August +
                      t.September +
                      t.October +
                      t.November +
                      t.December}
                  </b>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr style={{ backgroundColor: 'lightcyan' }}>
            <td>Total</td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>-</td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('January')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('February')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('March')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('April')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('May')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('June')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('July')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('August')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('September')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('October')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('November')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'right' }}>
              <b>{monthSumm('December')}</b>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default YrDMnA;
