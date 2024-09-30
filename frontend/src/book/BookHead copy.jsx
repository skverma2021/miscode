import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BookingContext } from '../context/book/BookingContext';
import BookDet from './BookDet';
import userContext from '../context/appUser/UserContext';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';

const BookHead = () => {
  const [empDet, setEmpDet] = useState({});
  const [wpDet, setWpDet] = useState([]);
  const [bookDays, setBookDays] = useState([]);
  const [msg, setMsg] = useState('');
  const [dtStatus, setDtStatus] = useState('');
  const [empStatus, setEmpStatus] = useState('');
  const [wpStatus, setWpStatus] = useState('');

  const bContext = useContext(BookingContext);
  const { getBStatus, getBMsg } = bContext;

  const { userId } = useContext(userContext);

  const navigate = useNavigate();
  const { m, y } = useParams();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getEmpDet();
    getWpDet();
    getBookingDates();
  }, []);

  // for employee summary on the top left of the booking form
  const getEmpDet = async () => {
    setEmpStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/empheader/${userId}`
      );
      setEmpDet(res.data[0]);
      setEmpStatus('Success');
    } catch (error) {
      setEmpStatus('Error');
      setMsg(
        (prevMsg) =>
          prevMsg +
          `[Error loading employee details: ${errNumber(error)} - ${errText(
            error
          )}] `
      );
    }
  };

  // to fill wpDet (workPlan Details)
  // for the column heads (workPlan details) of the booking sheet of the month
  const getWpDet = async () => {
    setWpStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/bookheader/${userId}/${m}/${y}`
      );
      setWpDet(res.data);
      setWpStatus('Success');
    } catch (error) {
      setWpStatus('Error');
      setMsg(
        (prevMsg) =>
          prevMsg +
          `[Error loading workplans: ${errNumber(error)} - ${errText(error)}] `
      );
    }
  };

  // gets all days of the month for the left most column
  const getBookingDates = async () => {
    setDtStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/bookings/bookdates/${m}/${y}`
      );
      setBookDays(res.data);
      setDtStatus('Success');
    } catch (error) {
      setDtStatus('Error');
      setMsg(
        (prevMsg) =>
          prevMsg +
          `[Error loading dates: ${errNumber(error)} - ${errText(error)}] `
      );
    }
  };

  if (empStatus === 'Error' || wpStatus === 'Error' || dtStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>{msg}</h1>;
  }

  if (getBStatus() === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>{getBMsg()}</h1>;
  }

  if (!userId) return <h1>Login again</h1>;

  if (wpDet.length == 0)
    return <h1>Getting Work Plans ... [{wpDet.length}]</h1>;

  if (empStatus === 'busy') return <Spinner />;
  if (wpStatus === 'busy') return <Spinner />;
  if (dtStatus === 'busy') return <Spinner />;

  return (
    <>
      {/* employee details in two lines */}
      <div style={{ backgroundColor: 'lightcyan', marginTop: '10px' }}>
        <u>
          <strong>{empDet.theName}</strong>, {empDet.theDesig}, [
          {empDet.theGrade}]
        </u>
      </div>
      <div>
        <i>
          {empDet.theDeptt}, {empDet.theDiscp}, [{empDet.theHrRate}Rs/hr,
          workPlans:{empDet.curWorkPlans}]
        </i>
      </div>
      {/* the entire sheet */}
      <table
        style={{ marginTop: '10px', borderCollapse: 'collapse', width: '100%' }}
      >
        {/* workPlan details - job, stage, department's share, start, finish etc. for each column */}
        <thead>
          <tr>
            <th style={{ background: 'lightgray', border: '1px solid' }}>
              day✖️job
            </th>
            {wpDet.map((t) => {
              return (
                <th
                  key={t.wpId}
                  style={{ border: '1px solid', background: 'lightblue' }}
                >
                  <small>
                    {t.nameJob}
                    <br />
                    <i>{t.nameStage}</i>[{t.wpId}]
                    <br />
                    {t.dtStart} to {t.dtEnd}
                    <br />
                    Allocated/Consumed:Rs.{t.workPlanDepttShare}/{t.consumed}
                    <br />
                  </small>
                </th>
              );
            })}
            <th style={{ border: '1px solid', background: 'lightgray' }}>
              <strong>save</strong>
            </th>
          </tr>
        </thead>
        {/* each <tr> is populated by BookDet component which displays booking made (or yet to be made) by the employee */}
        {/* for the day against each workPlan assigned to his/her deptt - ie forms cells for the row (day) */}
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
export default BookHead;
