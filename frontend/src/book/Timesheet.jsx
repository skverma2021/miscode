import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/appUser/UserContext';
import { BookingContext } from '../context/book/BookingContext';
import BookDet from './BookDet';
import BookHeader from './BookHeader';
import { errText, errNumber } from '../util/errMsgText';
import { useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const Timesheet = () => {

  // State Variables 
  const [bookDays, setBookDays] = useState([]);

  // status and error handling
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  // set the context with emp Id, hourly rate, month, and year
  const bContext = useContext(BookingContext);
  const { setEmpId, setHourlyRate, setMonth, setYear } = bContext;
  const { userId, hrRate } = useContext(userContext);
  const { m, y } = useParams();

  useEffect(() => {
    setEmpId(userId);
    setHourlyRate(hrRate);
    setMonth(m);
    setYear(y);
  }, [userId, hrRate, m, y]);

  // get booking dates when the component loads
  useEffect(() => {
    getBookingDates();
  }, []);
  const getBookingDates = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/bookdates/${m}/${y}`
      );
      setBookDays(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(`[Error loading dates: ${errNumber(error)} - ${errText(error)}] `);
    }
  };

  // error, login, and busy conditions
  if (status === 'Error') {
    return <GoHome secs={5000} msg={msg} />
  }
  if (!userId) return <h1>Login again</h1>;
  if (status === 'busy') return <Spinner />;

  return (
    <>
      <table
        style={{ marginTop: '7px', borderCollapse: 'collapse', width: '100%' }}
      >
        {/* Columns: workPlan details -job, stage, department's share, start, finish etc. */}
        <thead>
          <BookHeader />
        </thead>

        {/* each <tr> is populated by BookDet component which displays date, and booking made (or yet to be made) by the employee */}
        <tbody>
          {bookDays.map((d) => {
            return (
              <tr key={d.id}>
                <BookDet bookDay={d} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default Timesheet;
