import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';
import Spinner from '../home/Spinner';

const Transfer = () => {

// State Variables
  const [fromDt, setFromDt] = useState('');
  const [deptts, setTransfers] = useState([]);
  const [theDeptt, setTheDeptt] = useState('');

  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { transferId, transferDepttId, transferDt, empId } = tpContext.tpState;
  const { setTransfer, toggleTransferFlag } = tpContext;

// Updating State
  // to initialise lower window with context
  // the context gets filled by edit button in trail window using setter by context
  useEffect(() => {
    setTheDeptt(transferDepttId);
    setFromDt(transferDt);
  }, [transferDepttId, transferDt]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/departments/select`
        );
        setTransfers(res.data);
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
      if (transferId) {
        await axios.put(`http://localhost:3000/api/tp/empdeptt/${transferId}`, {
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
      toggleTransferFlag();
      setTransfer('', '', '');
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

// Navigation and TimeOut
  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

// User Interface
if (status === 'busy') return <Spinner />;
if (status === 'Error') {
  timeoutId = setTimeout(goHome, 5000);
  return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
}
  return (
    <>
        {transferId? <button onClick={() => setTransfer('', '', '')}>Initialise</button>: 'New Transfer'}
        <div style={{ display: 'flex',  justifyContent: 'space-between' }}>
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
          <button onClick={saveRec}>{transferId? 'Update':'Add'}</button>
        </div>
    </>
  );
};
export default Transfer;
