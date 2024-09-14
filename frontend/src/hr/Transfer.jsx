import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';

const Transfer = ({ theEmp }) => {
  const [fromDt, setFromDt] = useState('');
  const [deptts, setDeptts] = useState([]);
  const [theDeptt, setTheDeptt] = useState('');
  const tpContext = useContext(TPContext);
  const { trId, trDepttId, trFromDt } = tpContext.tpState;
  const { setDp, toggleDepttFlag, setStatus, setMsg } = tpContext;

  // to initialise lower window with context
  // the context gets filled by edit button in trail window using setter by context
  useEffect(() => {
    setTheDeptt(trDepttId);
    setFromDt(trFromDt);
  }, [trDepttId, trFromDt]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/departments/short`
        );
        setDeptts(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
      }
    };
    fetchData();
  }, []);

  const saveRec = async () => {
    if (theDeptt == '') return;
    setStatus('busy');
    try {
      if (trId) {
        await axios.put(`http://localhost:3000/api/tp/empdeptt/${trId}`, {
          empId: theEmp, // parameter received
          depttId: theDeptt, // state variable
          fromDt: fromDt, // state variable
        });
      } else {
        await axios.post('http://localhost:3000/api/tp/empdeptt', {
          empId: theEmp, // parameter received
          depttId: theDeptt, // state variable
          fromDt: fromDt, // state variable
        });
        // will cause the trail window to refresh because of useEffect
        // newDepttRec();
      }
      toggleDepttFlag();
      setDp('', '', '');
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  return (
    <>
      <h5>
        <button onClick={() => setDp('', '', '')}>Add</button>
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <select
            name='theDeptt'
            id='theDeptt'
            value={theDeptt || ''}
            onChange={(e) => setTheDeptt(e.target.value)}
          >
            <option value='0'>Select Deptt</option>
            {deptts.map((dp) => {
              return (
                <option key={dp.depttId} value={dp.depttId}>
                  {dp.depttName}
                </option>
              );
            })}
          </select>
          <input
            name='fromDt'
            value={fromDt}
            type='date'
            onChange={(e) => setFromDt(e.target.value)}
          />
          <button onClick={saveRec}>Save</button>
        </div>
      </div>
    </>
  );
};
export default Transfer;
