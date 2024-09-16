import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import BookDet from './BookDet';
import userContext from '../context/appUser/UserContext';
import { errText } from '../util/errMsgText';
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
  const [bookingStatus, setBookingStatus] = useState('');
  const [err, setErr] = useState(false);

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
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
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
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
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
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

  if (empStatus === 'Error')
    return (
      <h1 style={{ color: 'red' }}>
        Employee Details could not be loaded[Error: {msg}]
      </h1>
    );
  if (wpStatus === 'Error')
    return (
      <h1 style={{ color: 'red' }}>
        WorkPlan Details could not be loaded[Error: {msg}]
      </h1>
    );
  if (dtStatus === 'Error')
    return (
      <h1 style={{ color: 'red' }}>Dates could not be loaded[Error: {msg}]</h1>
    );
  if (bookingStatus === 'Error')
    return <h1 style={{ color: 'red' }}>Error encountered in booking</h1>;

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
                <BookDet
                  bookDay={d}
                  reportBookingStatus={(t) => setBookingStatus(t)}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};
export default BookHead;
