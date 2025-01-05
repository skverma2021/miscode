import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { BookingContext } from '../context/book/BookingContext';
import GoHome from '../util/GoHome';

//bookDay contains id, theDay, weekDay
const BookDet = ({ bookDay }) => {
  // state variables
  const [bData, setBData] = useState([]);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  // get the context with empId and hourlyRate
  const bContext = useContext(BookingContext);
  const { empId, hourlyRate } = bContext.bookingState;

  // get booking template - theWpId, theBooking, toUpd, inError, toEdit
  // theWpId: the workPlan ID
  // theBooking: the booking value null or actual
  // toUpd = 1 when booking is to be updated, 0 when it is a new booking case
  // inError = 1 when booking is not acceptable
  // toEdit = 1 when booking date is between schedule start and end date
  useEffect(() => {
    getBookingDet();
  }, []);
  const getBookingDet = async () => {
    try {
      setStatus('busy');
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${empId}/${bookDay.id}`
      );
      setBData(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(`[Error-Booking details: ${errNumber(error)} - ${errText(error)}]`);
    }
  };

  // for updating bData located at index
  const handleInputChange = (index, rec) => {
    setBData((prevBookData) => {
      const newBookData = [...prevBookData];
      newBookData[index][rec.propName] = rec.propValue;
      return newBookData;
    });
  };

  // handle - insert, delete and update on booking table
  const handleUpdAdd = () => {
    bData.map((t, idx) => {
      // t represents one of the bookings belonging to the day
      // idx is the index of the booking supplied by React
      if (isNaN(t.theBooking) || t.theBooking < 0) {
        // if booking is not a number or negative set inError = 1
        // a 0 for booking is acceptable
        // 0: ignored in insert cases
        // 0: treated as delete in update cases
        handleInputChange(idx, {
          propName: 'inError',
          propValue: 1,
        });
        return;
      }
      // bData contains booking data for each workPlan applicable for the day
      // t represents one of the bookings belonging to the day
      // even if API returns tpUpd as 0 (insert case) it becomes an update case after 1 save
      // it is necessary because the form remains open and user may revisit an inserted record and save it again
      if (t.toUpd > 0) {
        // update or delete when booking = 0
        updBooking(idx, empId, t.theWpId, bookDay.id, t.theBooking, hourlyRate);
      } else {
        if (t.theBooking > 0)
          // 
          addBooking(
            idx,
            empId,
            t.theWpId,
            bookDay.id,
            t.theBooking,
            hourlyRate
          );
      }
    });
  };

  // update or delete when booking = 0
  const updBooking = async (i, e, wp, d, b, h) => {
    const rec = {
      empId: e,
      workPlanId: wp,
      dateId: d,
      booking: b ? b : 0,
      bookingVal: b * h,
    };
    // value of booking = hours worked x hourly rate
    setStatus('busy');
    try {
      await axios.put(`http://localhost:3000/api/bookings/`, rec);
      // it helps to provide feedback to user in case of error inError=0 
      // useful when user corrects an invalid entry
      // in that case it will change the color of the input field from red to black
      handleInputChange(i, {
        propName: 'inError',
        propValue: 0,
      });
      setStatus('Success');
    } catch (error) {
      console.log('theError', errNumber(error));
      if (errNumber(error) == 500) {
        // an error beyond user control
        setStatus('Error');
        setMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        // an error due to user input
        handleInputChange(i, {
          propName: 'inError',
          propValue: 1,
        });
        console.log(errText(error))
      }
    }
  };

  // add new booking
  const addBooking = async (i, e, wp, d, b, h) => {
    const rec = {
      empId: e,
      workPlanId: wp,
      dateId: d,
      booking: b,
      bookingVal: b * h,
    };
    // value of booking = hours worked x hourly rate
    setStatus('busy');
    try {
      await axios.post(`http://localhost:3000/api/bookings/`, rec);
      handleInputChange(i, {
        propName: 'inError',
        propValue: 0,
      });
      // set toUpd = 1 to make it an update case next time
      handleInputChange(i, {
        propName: 'toUpd',
        propValue: 1,
      });
      setStatus('Success');
    } catch (error) {
      if (errNumber(error) == 500) {
        // an error beyond user control
        setStatus('Error');
        setMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        // an error due to user input
        handleInputChange(i, {
          propName: 'inError',
          propValue: 1,
        });
      }
    }
  };

  if (status === 'Error') {
    // in case of error return to home page
    return <GoHome secs={5000} msg={msg} />
  }
  return (
    <>
      {/* print date to start with */}
      <td style={{ border: '1px solid', background: 'lightblue' }}>
        <small>{bookDay.theDay}</small>
      </td>

      {/* pring booking template for each workplan */}
      {bData.map((t, idx) => {
        // t represents one of the bookings belonging to the day
        // idx is the index of the booking supplied by React
        return (

          <td
            key={idx}
            style={{
              margin: '0',
              padding: '0',
              textAlign: 'center',
              border: '1px solid',
            }}
          >
            <input
              value={t.theBooking || ''}
              // onChange={(e) => handleInputChange(idx, e)}
              onChange={(e) =>
                handleInputChange(idx, {
                  propName: 'theBooking',
                  propValue: e.target.value,
                })
              }
              disabled={t.toEdit == 0}
              style={{
                border: 'none',
                padding: '0',
                width: '100%',
                color: `${t.inError ? 'red' : 'black'}`,
                background: `${t.toEdit == 1 && 'lightgrey'}`,
                fontWeight: `${t.inError ? 'bold' : 'normal'}`,
              }}
              // title is a tooltip only for debugging
              // remove it in production
              title={
                'wpId:' +
                t.theWpId +
                ' idx:' +
                idx +
                ' inError:' +
                t.inError +
                ' booking:' +
                t.theBooking +
                ' toUpd:' +
                t.toUpd +
                ' toEdit:' +
                t.toEdit
              }
            />
          </td>
        );
      })}

      {/* finally end the row with save button */}
      <td style={{ border: '1px solid', textAlign: 'center' }}>
        <button onClick={handleUpdAdd}>💾</button>
      </td>
    </>
  );
};

export default BookDet;
