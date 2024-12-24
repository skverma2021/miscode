import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';
import Spinner from '../home/Spinner';

const Posting = () => {

// State Variables
  // for input controls in the form
  const [theDesig, setTheDesig] = useState('');
  const [fromDt, setFromDt] = useState('');

  // options for select control
  const [desigs, setPostings] = useState([]);

  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { postingId, postingDesigId, postingDt, empId } = tpContext.tpState;
  const { setPosting, togglePostingFlag } = tpContext;

// Updating State
  // to initialise lower window with context
  // the context gets filled by edit button in
  // trail window using setter by context
  useEffect(() => {
    setTheDesig(postingDesigId);
    setFromDt(postingDt);
  }, [postingDesigId, postingDt]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/designations/select`
        );
        setPostings(res.data);
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
    if (theDesig == '') return;
    setStatus('busy');
    try {
      if (postingId) {
        await axios.put(`http://localhost:3000/api/tp/empDesig/${postingId}`, {
          empId: empId, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
      } else {
        await axios.post('http://localhost:3000/api/tp/empdesig', {
          empId: empId, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
      }
      togglePostingFlag();
      setPosting('', '', '');
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
      <h5>
        <button onClick={() => setPosting('', '', '')}>Add</button>
      </h5>
        <div style={{ display: 'flex',  justifyContent: 'space-between' }}>
          <SelectControl
            optionsRows={desigs}
            selectedId={theDesig}
            onSelect={(d) => setTheDesig(d)}
            prompt={'Designation'}
          />
          <input
            name='fromDt'
            value={fromDt}
            type='date'
            onChange={(e) => setFromDt(e.target.value)}
          />
          <button onClick={saveRec}>💾</button>
        </div>
    </>
  );
};

export default Posting;
