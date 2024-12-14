import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';

const Transfer = () => {

// State Variables
  const [fromDt, setFromDt] = useState('');
  const [deptts, setDeptts] = useState([]);
  const [theDeptt, setTheDeptt] = useState('');
  const tpContext = useContext(TPContext);
  const { trId, trDepttId, trFromDt, empId } = tpContext.tpState;
  const { setDt, toggleDepttFlag, setStatus, setMsg } = tpContext;

// Updating State
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
          `http://localhost:3000/api/departments/select`
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

// Handling events on the form
  const saveRec = async () => {
    if (theDeptt == '') return;
    setStatus('busy');
    try {
      if (trId) {
        await axios.put(`http://localhost:3000/api/tp/empdeptt/${trId}`, {
          empId: empId, // parameter received
          depttId: theDeptt, // state variable
          fromDt: fromDt, // state variable
        });
      } else {
        await axios.post('http://localhost:3000/api/tp/empdeptt', {
          empId: empId, // parameter received
          depttId: theDeptt, // state variable
          fromDt: fromDt, // state variable
        });
        // will cause the trail window to refresh because of useEffect
        // newDepttRec();
      }
      toggleDepttFlag();
      setDt('', '', '');
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

// User Interface
  return (
    <>
      <h5>
        <button onClick={() => setDt('', '', '')}>Add</button>
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
          <SelectControl
            optionsRows={deptts}
            selectedId={theDeptt}
            onSelect={(d) => setTheDeptt(d)}
            prompt={'Department'}
          />
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
