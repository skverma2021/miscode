import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const DepttGradeXtab = () => {
  const [eSumm, setESumm] = useState([]);

  useEffect(() => {
    getESumm();
  }, []);

  const getESumm = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/reports/summDG`);
      setESumm(res.data);
    } catch (error) {
      console.log(error);
    }
  };
  const gradeSumm = (ex) => {
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
      <h1>Employees Summary - Numbers accross Grades</h1>
      <table style={{ border: '1px solid black', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid black' }}>Department</th>
            <th style={{ border: '1px solid black' }}>E1</th>
            <th style={{ border: '1px solid black' }}>E2</th>
            <th style={{ border: '1px solid black' }}>E3</th>
            <th style={{ border: '1px solid black' }}>E4</th>
            <th style={{ border: '1px solid black' }}>E5</th>
            <th style={{ border: '1px solid black' }}>E6</th>
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
                <td style={{ border: '1px solid gray' }}>{t.theDepartment}</td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E1}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E2}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E3}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E4}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E5}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  {t.E6}
                </td>
                <td style={{ border: '1px solid gray', textAlign: 'center' }}>
                  <b>{t.E1 + t.E2 + t.E3 + t.E4 + t.E5 + t.E6}</b>
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr>
            <td>Total</td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E1')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E2')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E3')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E4')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E5')}</b>
            </td>
            <td style={{ border: '1px solid gray', textAlign: 'center' }}>
              <b>{gradeSumm('E6')}</b>
            </td>
          </tr>
        </tfoot>
      </table>
    </>
  );
};

export default DepttGradeXtab;
