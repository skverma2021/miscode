import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const BookDet = ({ empId, bookDay, hourlyRate, reportBookingStatus }) => {
  const [bData, setBData] = useState([]);

  useEffect(() => {
    getBookingDet();
  }, []);

  const getBookingDet = async () => {
    try {
      reportBookingStatus('busy')
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${empId}/${bookDay.id}`
      );
      setBData(res.data);
      reportBookingStatus('Sucess')
    } catch (error) {
      reportBookingStatus('Error');
    }
  };

  const handleInputChange = (index, e) => {
    if (isNaN(e.target.value)) return;
    setBData((prevBData) => {
      const oldBooking = parseFloat(prevBData[index].theBooking);
      const updatedBData = [...prevBData];
      updatedBData[index].theBooking = e.target.value;
      const deltaBooking = parseFloat(e.target.value - oldBooking);
      updatedBData[index].remainingVal = parseFloat(updatedBData[index].remainingVal - deltaBooking * hourlyRate);
      return updatedBData;
    });
  };

  // [inError]
  // this will make the <input />  stand out in RED to indicate error condition
  const setError = (index, errVal) => {
    setBData((prevBData) => {
      const updatedBData = [...prevBData];
      updatedBData[index].inError = errVal;
      return updatedBData;
    });
  };

  // toUpd
  const handleSaveCount = (index) => {
    setBData((prevBooking) => {
      const updatedBooking = [...prevBooking];
      updatedBooking[index].toUpd = updatedBooking[index].toUpd + 1;
      return updatedBooking;
    });
  };

  const handleUpdAdd = () => {
    bData.map((t) => {

      // if ((isNaN(t.theBooking)) ||(t.theBooking < 0) || (t.changeInBooking * hourlyRate > t.remainingVal)){
      //   setError(t.idx, 1)
      //   return;
      // }
      if ((t.theBooking < 0)  || (t.remainingVal < 0)){
        setError(t.idx, 1)
        return;
      }
      // bData contains booking data for each workPlan applicable for the day
      // t represents one of the bookings belonging to the day
      // even if API returns tpUpd as 0 (POST/append case) it becomes an update case after 1 save
      // when the form remains open and user revisits and saves it again
      if (t.toUpd > 0 ) {
        updBooking(
          t.idx,
          empId,
          t.theWpId,
          bookDay.id,
          t.theBooking,
          hourlyRate
        );
      } else {
        if (t.theBooking > 0)
          addBooking(
            t.idx,
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
      // value of booking = hours worked x hourly rate
      bookingVal: b * h,
    };
    reportBookingStatus('busy')
    try {
      const res = await axios.put(`http://localhost:3000/api/bookings/`, rec);
      setError(i, 0); // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      reportBookingStatus('Success')
    } catch (error) {
      reportBookingStatus('Error');
    }
  };

  const addBooking = async (i, e, wp, d, b, h) => {
    const rec = {
      empId: e,
      workPlanId: wp,
      dateId: d,
      booking: b,
      // value of booking = hours worked x hourly rate
      bookingVal: b * h,
    };
    reportBookingStatus('busy')
    try {
      const res = await axios.post(`http://localhost:3000/api/bookings/`, rec);
      setError(i, 0); // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      handleSaveCount(i)
      reportBookingStatus('Success')
    } catch (error) {
      reportBookingStatus('Error');
    }
  };

  return (
    <>
      <td style={{ border: '1px solid', background: 'lightblue' }}>
        <small>{bookDay.theDay}</small>
      </td>
      {bData.map((t) => {
        return (
          // number of <td> each containing one <input> depends on no of rows in bData
          // for the purpose of onChange each is to be accessed based on 'idx' property
          // the route returns each row with idx = 0 or 'no of records '
          // idx and event e is passed to handleInputChange to be used for updating the booking value
          <td
            key={t.idx}
            style={{
              margin: '0',
              padding: '0',
              textAlign: 'center',
              border: '1px solid',
            }}
          >
            <input
              value={t.theBooking || ''}
              onChange={(e) => handleInputChange(t.idx, e)}
              // in case you want to see values of these
              // theWpId, idx, inError, toSave, theBooking, toUpd, d1, d2
              // d1 is +ve when schedule start is before booking date
              // d2 is +ve when booking date is before schedule end date
              title={ 'wpId:' + t.theWpId + ' idx:' + t.idx + ' remaining:' + t.remainingVal + ' inError:' + t.inError +  ' booking:' +  t.theBooking +
                ' toUpd:' + t.toUpd + ' d1:' +  t.d1 +  ' d2:' + t.d2 }
              disabled={t.d1 < 0 || t.d2 < 0}
              style={{
                border: 'none',
                padding: '0',
                width: '100%',
                color: `${t.inError ? 'red' : 'black'}`,
                background: `${t.d1 >= 0 && t.d2 >= 0 && 'lightgrey'}`,
                fontWeight:`${
                  t.inError ? 'bold' : 'normal'
                }`
              }}
            />
          </td>
        );
      })}
      <td
        style={{
          border: '1px solid',
          textAlign: 'center',
        }}
      >
        <button onClick={handleUpdAdd}>💾</button>
      </td>
      {/* <div style={{ width: '5%' }}>action</div>💾🖍️💽 */}
    </>
  );
};

export default BookDet;
