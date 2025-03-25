import React from 'react';
import { useState } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import GoHome from '../util/GoHome';

const BookDet = ({ empId, bookingData, hourlyRate }) => {

  // state variables
  const [bData, setBData] = useState(bookingData);
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  // Group data by theRow
  const groupedData = bData.reduce((acc, item) => {
    if (!acc[item.theRow]) {
      acc[item.theRow] = [];
    }
    acc[item.theRow].push(item);
    return acc;
  }, {});

  const theIndex = (row, col) => {
    // each row has a fixed number of columns
    const columnsPerRow = groupedData[Object.keys(groupedData)[0]].length;
    return columnsPerRow * row + col;
  };

  const handleInputChange = (rec) => {
    setBData((prevBookData) => {
      const newBookData = [...prevBookData];
      const index = theIndex(rec.row, rec.col);
      newBookData[index] = {
        ...newBookData[index],
        [rec.theProp]: rec.theValue,
        hasChanged: 1,
      };
      return newBookData;
    });
  };

  // handle - insert, delete and update on booking table
  const handleUpdAdd = () => {
    // console.log('handleUpdAdd');
    bData.map((t) => {
      // t represents one of the bookings belonging to the day and a workplan
      // t: theDate, theDateId, theRow, theCol, theWpId, theBooking,  toUpd, inError, enabled, hasChanged

      // move to next booking if no change
      if (t.hasChanged == 0) return;

      if (isNaN(t.theBooking) || t.theBooking < 0) {
        // if booking is not a number or negative set inError = 1
        // a 0 for booking is acceptable
        // booking = 0: ignored in insert cases
        // booking = 0: treated as delete in update cases

        handleInputChange({
          row: t.theRow,
          col: t.theCol,
          theProp: 'inError',
          theValue: 1,
        })
        return;
      }

      // even if API returns tpUpd as 0 (insert case) it becomes an update case after 1 save
      // it is necessary because the form remains open and user may revisit an inserted record and save it again

      if (t.toUpd > 0) {
        // update or delete when booking = 0
        updBooking(t.theRow, t.theCol, empId, t.theWpId, t.theDateId, t.theBooking, hourlyRate);

      } else {
        if (t.theBooking > 0)
          addBooking(t.theRow, t.theCol, empId, t.theWpId, t.theDateId, t.theBooking, hourlyRate);
      }
    });
  };

  // update or delete when booking = 0
  const updBooking = async (r, c, e, wp, d, b, h) => {
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
      // it helps to provide feedback to user in case of error and success
      handleInputChange({
        row: r,
        col: c,
        theProp: 'inError',
        theValue: 0,
      })
      setStatus('Success');
    } catch (error) {
      console.log('theError', errNumber(error));
      if (errNumber(error) == 500) {
        // an error beyond user control
        setStatus('Error');
        setMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        // an error due to user input
        handleInputChange({
          row: r,
          col: c,
          theProp: 'inError',
          theValue: 1,
        })
        console.log(errText(error))
      }
    }
  };

  // add new booking
  const addBooking = async (r, c, e, wp, d, b, h) => {
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
      handleInputChange({
        row: r,
        col: c,
        theProp: 'inError',
        theValue: 0,
      })
      // set toUpd = 1 to make it an update case next time
      handleInputChange({
        row: r,
        col: c,
        theProp: 'toUpd',
        theValue: 1,
      })
      setStatus('Success');
    } catch (error) {
      if (errNumber(error) == 500) {
        // an error beyond user control
        setStatus('Error');
        setMsg(`[Error-Booking: ${errNumber(error)} - ${errText(error)}] `);
      } else {
        // an error due to user input
        handleInputChange({
          row: r,
          col: c,
          theProp: 'inError',
          theValue: 1,
        })
      }
    }
  };

  if (status === 'Error') {
    // in case of error return to home page
    return <GoHome secs={5000} msg={msg} />
  }

  return (
    <>
      <tr>
        <td style={{ textAlign: 'center', backgroundColor: 'Highlight' }}>
          {bData.length > 0 && <button onClick={handleUpdAdd} title='Save'>
            💾
          </button>}

        </td>
      </tr>
      {Object.keys(groupedData).map((rowKey) => (
        <tr key={rowKey}>
          <td style={{ border: '1px solid', background: 'lightblue', fontSize: 'small' }}>
            <label>{groupedData[rowKey][0].theDate}</label>
          </td>
          {groupedData[rowKey].map((item, index) => (
            <td key={index} style={{
              margin: '0',
              padding: '0',
              textAlign: 'center',
              border: '1px solid',
            }}>
              <input
                value={item.theBooking || ''}
                onChange={(e) =>
                  handleInputChange({
                    row: item.theRow,
                    col: item.theCol,
                    theProp: 'theBooking',
                    theValue: e.target.value,
                  })
                }
                disabled={item.enabled == 0}
                style={{
                  border: 'none',
                  padding: '0',
                  width: '100%',
                  color: `${item.inError ? 'red' : 'black'}`,
                  background: `${item.enabled == 1 && 'lightgrey'}`,
                  fontWeight: `${item.inError ? 'bold' : 'normal'}`,
                }}
                title={
                  'wpId:' + item.theWpId + ', inError:' + item.inError + ', booking:' + item.theBooking +
                  ', toUpd:' + item.toUpd + ', enabled:' + item.enabled + ', hasChanged:' + item.hasChanged}
              />
            </td>
          ))}

        </tr>
      ))}
    </>
  );
};

export default BookDet;
