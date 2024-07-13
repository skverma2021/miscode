import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DepttAgeXtab = () => {
  const [eSumm, setESumm] = useState([]);

  useEffect(() => {
    getESumm();
  }, []);

  const getESumm = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reports/summDA`);
      setESumm(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const ageSumm = (ex) => {
    return eSumm.reduce(
      (accumulator, currentValue) => accumulator + currentValue[ex],
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
  return (
    <>
      <h1>Employees Summary - Numbers accross AgeGroups</h1>
      <table style={{ border: '1px solid black', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Department</th>
            <th style={{ border: '1px solid black' }}>20s</th>
            <th style={{ border: '1px solid black' }}>30s</th>
            <th style={{ border: '1px solid black' }}>40s</th>
            <th style={{ border: '1px solid black' }}>50s</th>
            <th style={{ border: '1px solid black' }}>60s</th>
            <th style={{ border: '1px solid black' }}>Total</th>
          </tr>
        </thead>
        <tbody>
          {eSumm.map((t) => {
            return (
              <tr
                key={t.theDepttId}
                style={{ backgroundColor: `${bgColor(t.theDepttId)}` }}
              >
                <td style={{ border: '1px solid gray' }}>{t.depttName}</td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.gr20s}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.gr30s}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.gr40s}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.gr50s}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.gr60s}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  <b>{t.gr20s + t.gr30s + t.gr40s + t.gr50s + t.gr60s}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{ageSumm('gr20s')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{ageSumm('gr30s')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{ageSumm('gr40s')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{ageSumm('gr50s')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{ageSumm('gr60s')}</b>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default DepttAgeXtab;
