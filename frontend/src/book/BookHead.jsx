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
  // fetch workplans and booking dates
  const [wpDet, setWpDet] = useState([]);
  const [bookDays, setBookDays] = useState([]);

  // status and error handling
  const [msg, setMsg] = useState('');
  const [dtStatus, setDtStatus] = useState('');
  const [wpStatus, setWpStatus] = useState('');
  const bContext = useContext(BookingContext);
  const { getBStatus, getBMsg } = bContext;

  // get employee whose timesheet is to be created and
  // month and year of timesheet
  const { userId } = useContext(userContext);
  const { m, y } = useParams();

  // navigation to home and timer
  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // get workplans and booking dates when the component loads
  useEffect(() => {
    getWpDet();
    getBookingDates();
  }, []);

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

  // error, login, and busy conditions
  if (wpStatus === 'Error' || dtStatus === 'Error') {
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
  if (wpStatus === 'busy' || dtStatus === 'busy') return <Spinner />;

  return (
    <>
      <table
        style={{ marginTop: '7px', borderCollapse: 'collapse', width: '100%' }}
      >
        {/* Columns: workPlan details -job, stage, department's share, start, finish etc. */}
        <thead>
          <tr>
            <td style={{ background: 'lightgray', border: '1px solid' }}>
              <small>
                <table>
                  <tbody>
                    <tr>
                      <td>Job</td>
                      <td>:</td>
                    </tr>
                    <tr>
                      <td>
                        <b>Workplan</b>
                      </td>
                      <td>:</td>
                    </tr>
                    <tr>
                      <td>Schedule</td>
                      <td>:</td>
                    </tr>
                    <tr>
                      <td>total/used</td>
                      <td>:</td>
                    </tr>
                  </tbody>
                </table>
              </small>
            </td>
            {wpDet.map((t) => {
              return (
                <td
                  key={t.wpId}
                  style={{ border: '1px solid', background: 'lightblue' }}
                >
                  <small>
                    <table>
                      <tbody>
                        <tr>
                          <td>{t.nameJob}</td>
                        </tr>
                        <tr>
                          <td>
                            <b>{t.nameStage}</b>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {t.dtStart} to {t.dtEnd}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            Rs.{t.workPlanDepttShare}/{t.consumed}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </small>
                </td>
              );
            })}
            <td style={{ border: '1px solid', background: 'lightgray' }}>
              <strong>save</strong>
            </td>
          </tr>
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
export default BookHead;
