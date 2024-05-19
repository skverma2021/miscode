import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { errText, errNumber } from '../util/errMsgText';

const BookDet = ({ empId, bookDay, hourlyRate }) => {
  const [bData, setBData] = useState([]);
  const [saveCount, setSaveCount] = useState(0);

  const [msg, setMsg] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);

  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    getBookingDet();
  }, []);

  const getBookingDet = async () => {
    try {
      setBookingStatus('busy')
      const res = await axios.get(
        `http://localhost:3000/api/bookings/${empId}/${bookDay.id}`
      );
      setBData(res.data);
      setBookingStatus('Sucess')
    } catch (error) {
      setBookingStatus('Error');
      setMsg(errText(error));
      setErrNo(500);
    }
  };

  // [theBooking], [toSave]
  // all the rows of bData is saved in a new temp object (updatedBData)
  // based on the index the 'theBooking' and 'toSave' property get new values
  // the property 'theBooking' gets new value entered by the user
  // the property 'toSave' becomes 1 ( it came as 0 )
  // toSave = 1 indicates that user has touched it and it needs to be saved

  const handleInputChange = (index, e) => {
    const newValue = e.target.value;
    setBData((prevBData) => {
      const updatedBData = [...prevBData];
      updatedBData[index].theBooking = newValue;
      updatedBData[index].toSave = 1;
      return updatedBData;
    });
  };

  // [inError]
  // this will make the <input />  RED to indicate error condition
  const setError = (index, errVal) => {
    const newValue = errVal;
    setBData((prevBData) => {
      const updatedBData = [...prevBData];
      updatedBData[index].inError = newValue;
      return updatedBData;
    });
  };

  // [toSave]
  // this record will not be saved later  unless user touches it again
  // a 0 for toSave will avoid a put API call
  const setToSave = (index) => {
    setBData((prevBData) => {
      const updatedBData = [...prevBData];
      updatedBData[index].toSave = 0;
      return updatedBData;
    });
  };

  const handleUpdAdd = () => {
    bData.map((t) => {
      // bData contains booking data for each workPlan applicable for the day
      // t represents one of the bookings belonging to the day
      // even if API returns tpUpd as 0 (POST/append case) it becomes an update case after 1 save
      // when the form remains open and user revisits and saves it again
      // the state variable saveCount was 0 and after one save it goes up by one
      if (t.toSave == 1) {
        if (t.toUpd > 0 || (t.toUpd == 0 && saveCount > 0)) {
          // update if the user has actually touched it
          // upon touching the onChange eventHandler makes it(toSave) 1
          // we are avoiding PUT API calls for records that have not changed
          // if (t.toSave == 1) {
          // in case theBooking is empty (when user deletes it) a 0 will be saved by updBooking function
          updBooking(
            t.idx,
            empId,
            t.theWpId,
            bookDay.id,
            t.theBooking,
            hourlyRate
          );
          // }
        } else {
          //Add
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
    setStatus('busy')
    try {
      const res = await axios.put(`http://localhost:3000/api/bookings/`, rec);
      setError(i, 0); // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      setToSave(i); // will make toSave = 0 for ith row to avoid unnecessary save unless user revisits
      setStatus('Success')
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error)); // it sets msg that will be displayed when component returns h1 (errNo = 500)
      setErrNo(errNumber(error)); // when errNo = 500, the components returns a h1 else it will make the input red
      setError(i, 1); // inError = 1 => error only for ith row of bData
    }
  };

  const addBooking = async (i, e, wp, d, b, h) => {
    const rec = {
      empId: e,
      workPlanId: wp,
      dateId: d,
      booking: b,
      bookingVal: b * h,
    };
    setStatus('busy')
    try {
      const res = await axios.post(`http://localhost:3000/api/bookings/`, rec);

      setSaveCount(saveCount + 1); // to make it an update case next time
      setError(i, 0); // it helps to provide feedback to user in case of error inError=0 => no error in ith row
      setToSave(i); // will make toSave = 0 for ith row to avoid unnecessary save unless user revisits
      setStatus('Success')
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error)); // it sets msg that will be displayed when component returns h1 (errNo = 500)
      setErrNo(errNumber(error)); // when errNo = 500, the components returns a h1 else it will make the input red
      setError(i, 1); // inError = 1 => error only for ith row of bData
    }
  };

  if (bookingStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Booking Details could not be loaded [Error: {msg}]</h1>;
  }

  return (
    <>
      <td style={{ border: '1px solid', background: 'lightblue' }}>
        <small>{bookDay.theDay}</small>
      </td>
      {bData.map((t) => {
        return (
          // number of <td> each containing one <input> depends on no of rows in bData
          // for the purpose of onChange each is to be accessed based on 'idx' property
          // the route returns each row with idx : 0 to 'no of records in bData'
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
              type='number'
              value={t.theBooking || ''}
              // can not work for more than 24 hrs
              max='24'
              min='0'
              onChange={(e) => handleInputChange(t.idx, e)}

              // in case you want to see values of these
              // theWpId, idx, inError, toSave, theBooking, toUpd, d1, d2
              // d1 is +ve when schedule start is before booking date
              // d2 is +ve when booking date is before schedule end date
              title={
                'wpId:' +
                t.theWpId +
                ' idx:' +
                t.idx +
                ' inError:' +
                t.inError +
                ' toSave:' +
                t.toSave +
                ' booking:' +
                t.theBooking +
                ' toUpd:' +
                t.toUpd +
                ' d1:' +
                t.d1 +
                ' d2:' +
                t.d2
              }

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
