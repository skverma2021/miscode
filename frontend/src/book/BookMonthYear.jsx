import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BookMonthYear = () => {
  const [mtext, setMtext] = useState('');

  return (
    <>
      <div
        style={{
          marginTop: '250px',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <table>
          <tbody>
            <tr><td>
              <h2 >Booking for the Month</h2>
            </td></tr>
            <tr><td>
              <input
                type='month'
                min='2022-01'
                max='2025-12'
                value={mtext}
                onChange={(e) => {
                  return setMtext(e.target.value);
                }}
              />
            </td></tr>
            <tr><td>
              {mtext !== '' && <Link
                to={`/booking/${mtext.substring(5, 7)}/${mtext.substring(0, 4)}`}
              >
                <br /><small><i>Log Hours Worked [for Year - Month: {mtext}]</i></small>
              </Link> }
            </td></tr>
          </tbody>

        </table>
      </div>
    </>
  );
};

export default BookMonthYear;
