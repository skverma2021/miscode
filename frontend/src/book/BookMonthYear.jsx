import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const BookMonthYear = () => {
  const [mtext, setMtext] = useState('');
  // const { id } = useParams();

  return (
    <>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          marginTop: '200px',
          marginLeft: '300px',
          marginRight: '300px',
        }}
      >
        <h2 style={{ marginBottom: '50px' }}>Booking for the Month</h2>

        <input
          type='month'
          min='2022-01'
          max='2025-12'
          value={mtext}
          onChange={(e) => {
            return setMtext(e.target.value);
          }}
        />
        <div>
          <Link
            to={`/booking/${mtext.substring(5, 7)}/${mtext.substring(0, 4 )}`}
          >
            {' '}
            Log Hours Booked
          </Link>
        </div>
      </div>
    </>
  );
};

export default BookMonthYear;
