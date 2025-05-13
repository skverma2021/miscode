import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const Posting = () => {
  // Input state
  const [theDesig, setTheDesig] = useState('');
  const [fromDt, setFromDt] = useState('');

  // Dropdown options
  const [desigs, setPostings] = useState([]);

  // Status handling
  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { postingId, postingDesigId, postingDt, empId } = tpContext.tpState;
  const { setPosting, togglePostingFlag } = tpContext;

  // Sync state with context on edit
  useEffect(() => {
    setTheDesig(postingDesigId);
    setFromDt(postingDt);
  }, [postingDesigId, postingDt]);

  // Fetch dropdown data
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

  // Save data
  const saveRec = async () => {
    if (theDesig === '') return;
    setStatus('busy');
    try {
      if (postingId) {
        await axios.put(`http://localhost:3000/api/tp/empDesig/${postingId}`, {
          empId,
          desigId: theDesig,
          fromDt,
        });
      } else {
        await axios.post(`http://localhost:3000/api/tp/empdesig`, {
          empId,
          desigId: theDesig,
          fromDt,
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

  // UI rendering
  if (status === 'busy') return <Spinner />;
  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: ${msg}`} />;
  }

  return (
    <>
      {postingId ? (
        <button onClick={() => setPosting('', '', '')}>Initialise</button>
      ) : (
        'New Posting'
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <SelectControl
          optionsRows={desigs}
          selectedId={theDesig}
          onSelect={(d) => setTheDesig(d)}
          prompt="Designation"
        />
        <input
          name="fromDt"
          value={fromDt}
          type="date"
          onChange={(e) => setFromDt(e.target.value)}
        />
        <button onClick={saveRec}>{postingId ? 'Update' : 'Add'}</button>
      </div>
    </>
  );
};

export default Posting;
