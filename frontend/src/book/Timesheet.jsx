import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import userContext from '../context/appUser/UserContext';
import BookDet from './BookDet';
import BookHeader from './BookHeader';
import { errText, errNumber } from '../util/errMsgText';
import { useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const Timesheet = () => {

  // State Variables 
  const [timesheetData, setTimesheetData] = useState([]);

  // status and error handling
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const { userId: empId, hrRate, depttId } = useContext(userContext);
  const { m, y } = useParams();

  useEffect(() => {
    getBookingDet();
  }, []);
  const getBookingDet = async () => {
    try {
      setStatus('busy');
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${empId}/${depttId}/${m}/${y}`
      );
      setTimesheetData(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(`[Error-Booking details: ${errNumber(error)} - ${errText(error)}]`);
    }
  };

  // error, login, and busy conditions
  if (status === 'Error') {
    return <GoHome secs={5000} msg={msg} />
  }
  if (!empId) return <h1>Login again</h1>;
  if (status === 'busy') return <Spinner />;

  return (
    <>
      <table
        style={{ marginTop: '7px', borderCollapse: 'collapse', width: '100%' }}
      >
        <thead>
          <BookHeader empId={empId} month={m} year={y} />
        </thead>
        <tbody>
          <BookDet empId={empId} bookingData={timesheetData} hourlyRate={hrRate} />
        </tbody>
      </table>
    </>
  );
};
export default Timesheet;
