import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TPContext from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import Spinner from '../home/Spinner';

const Posting = ({ theEmp }) => {
  const [fromDt, setFromDt] = useState('');
  const [desigs, setDesigs] = useState([]);
  const [theDesig, setTheDesig] = useState('');
  const tpContext = useContext(TPContext);
  const { postId, postDesigId, postFromDt } = tpContext.tpState;
  const { resetTP, updDesigRec, newDesigRec } = tpContext;
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');

  const navigate = useNavigate();
  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // to initialise lower window with context
  // the context gets filled by edit button in trail window using setter by context
  useEffect(() => {
    setTheDesig(postDesigId);
    setFromDt(postFromDt);
  }, [postDesigId, postFromDt]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/designations/short`
        );
        setDesigs(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
        timeoutId = setTimeout(goHome, 10000);
      }
    };
    fetchData();
  }, []);

  const saveRec = async () => {
    if (theDesig == '') return;
    setStatus('busy');
    try {
      if (postId) {
        await axios.put(`http://localhost:3000/api/tp/empDesig/${postId}`, {
          empId: theEmp, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
        resetTP();
        // will cause the trail window to refresh because of useEffect
        updDesigRec();
      } else {
        await axios.post('http://localhost:3000/api/tp/empdesig', {
          empId: theEmp, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
        // will cause the trail window to refresh because of useEffect
        newDesigRec();
      }
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      timeoutId = setTimeout(goHome, 10000);
    }
  };

  if (status === 'busy') return <Spinner />;

  if (status === 'Error') return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <h5>
          {postId ? (
            <button onClick={() => resetTP()}>✖️</button>
          ) : (
            'Add Postings'
          )}
        </h5>
        <div style={{ display: 'flex' }}>
          <select
            name='theDesig'
            id='theDesig'
            value={theDesig || ''}
            onChange={(e) => setTheDesig(e.target.value)}
          >
            <option value='0'>Select Designation</option>
            {desigs.map((dg) => {
              return (
                <option key={dg.theDesigId} value={dg.theDesigId}>
                  {dg.theDescription}
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

export default Posting;
