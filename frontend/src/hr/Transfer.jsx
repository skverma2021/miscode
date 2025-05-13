import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';
import Spinner from '../home/Spinner';
import GoHome from '../util/GoHome';

const Transfer = () => {
  const [fromDt, setFromDt] = useState('');
  const [deptts, setTransfers] = useState([]);
  const [theDeptt, setTheDeptt] = useState('');

  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  const tpContext = useContext(TPContext);
  const { transferId, transferDepttId, transferDt, empId } = tpContext.tpState;
  const { setTransfer, toggleTransferFlag } = tpContext;

  // Set initial values from context
  useEffect(() => {
    setTheDeptt(transferDepttId);
    setFromDt(transferDt);
  }, [transferDepttId, transferDt]);

  // Load department options
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

  // Save record: insert or update
  const saveRec = async () => {
    if (theDeptt === '') return;
    setStatus('busy');
    try {
      if (transferId) {
        await axios.put(`http://localhost:3000/api/tp/empdeptt/${transferId}`, {
          empId,
          depttId: theDeptt,
          fromDt,
        });
      } else {
        await axios.post('http://localhost:3000/api/tp/empdeptt', {
          empId,
          depttId: theDeptt,
          fromDt,
        });
      }
      toggleTransferFlag();
      setTransfer('', '', '');
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  if (status === 'busy') return <Spinner />;
  if (status === 'Error') {
    return <GoHome secs={5000} msg={`Error: ${msg}`} />;
  }

  return (
    <>
      {transferId ? (
        <button onClick={() => setTransfer('', '', '')}>Initialise</button>
      ) : (
        'New Transfer'
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
        <button onClick={saveRec}>{transferId ? 'Update' : 'Add'}</button>
      </div>
    </>
  );
};

export default Transfer;
