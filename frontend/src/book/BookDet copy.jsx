import React from 'react';
import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import userContext from '../context/appUser/UserContext';
import { BookingContext } from '../context/book/BookingContext';

const BookDet = ({ bookDay }) => {
  const [bData, setBData] = useState([]);
  // userId of Context will be accessed as empId and
  // hrRate of Context will be accessed as hourlyRate
  const { userId: empId, hrRate: hourlyRate } = useContext(userContext);

  // error reporting to parent via context
  const bContext = useContext(BookingContext);
  const { setBStatus, setBMsg } = bContext;

  // get booking template - workPlanId, index, inError ?, booking - actual/null, toUpd ?, toEdit ?
  useEffect(() => {
    getBookingDet();
  }, []);
  const getBookingDet = async () => {
    try {
      setBStatus('busy');
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${empId}/${bookDay.id}`
      );
      setBData(res.data);
      setBStatus('Success');
    } catch (error) {
      setBStatus('Error');
      setBMsg(
        `[Error-Booking details: ${errNumber(error)} - ${errText(error)}]`
      );
    }
  };

  // for updating bData located at index
  const handleInputChange = useCallback((index, rec) => {
    setBData((prevBookData) => {
      const newBookData = [...prevBookData];
      newBookData[index][rec.propName] = rec.propValue;
      return newBookData;
    });
  }, []);

  // handle - insert, delete and update on booking table
  const handleUpdAdd = () => {
    bData.map((t, idx) => {
      if (isNaN(t.theBooking) || t.theBooking < 0) {
        handleInputChange(idx, {
          propName: 'inError',
          propValue: 1,
        });
        return;
      }
      // bData contains booking data for each workPlan applicable for the day
      // t represents one of the bookings belonging to the day
      // even if API returns tpUpd as 0 (POST/append case) it becomes an update case after 1 save
      // when the form remains open and user revisits and saves it again
      if (t.toUpd > 0) {
        updBooking(idx, empId, t.theWpId, bookDay.id, t.theBooking, hourlyRate);
      } else {
        if (t.theBooking > 0)
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
    setBStatus('busy');
    try {
      await axios.put(`http://localhost:3000/api/bookings/`, rec);
      // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      handleInputChange(i, {
        propName: 'inError',
        propValue: 0,
      });
      setBStatus('Success');
    } catch (error) {
      console.log('theError', errNumber(error));
      if (errNumber(error) == 500) {
        setBStatus('Error');
        setBMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        handleInputChange(i, {
          propName: 'inError',
          propValue: 1,
        });
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
    setBStatus('busy');
    try {
      await axios.post(`http://localhost:3000/api/bookings/`, rec);
      // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      handleInputChange(i, {
        propName: 'inError',
        propValue: 0,
      });
      handleInputChange(i, {
        propName: 'toUpd',
        propValue: 1,
      });
      setBStatus('Success');
    } catch (error) {
      if (errNumber(error) == 500) {
        setBStatus('Error');
        setBMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        handleInputChange(i, {
          propName: 'inError',
          propValue: 1,
        });
      }
    }
  };

  return (
    <>
      {/* print date to start with */}
      <td style={{ border: '1px solid', background: 'lightblue' }}>
        <small>{bookDay.theDay}</small>
      </td>

      {/* pring booking template for each workplan */}
      {bData.map((t, idx) => {
        return (
          // number of <td> each containing one <input> depends on no of rows in bData
          // for the purpose of onChange each is to be accessed based on 'idx' property
          // the route returns each row with idx = 0 or 'no of records '
          // idx and event e is passed to handleInputChange to be used for updating the booking value

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
              // in case you want to see values of these
              // theWpId, idx, inError, toSave, theBooking, toUpd, d1, d2
              // d1 is +ve when schedule start is before booking date
              // d2 is +ve when booking date is before schedule end date
              // disabled={t.d1 < 0 || t.d2 < 0}
              disabled={t.toEdit == 0}
              style={{
                border: 'none',
                padding: '0',
                width: '100%',
                color: `${t.inError ? 'red' : 'black'}`,
                background: `${t.toEdit == 1 && 'lightgrey'}`,
                fontWeight: `${t.inError ? 'bold' : 'normal'}`,
              }}
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
