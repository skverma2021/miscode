import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';

const Posting = ({ theEmp, reportStatus, reportMsg }) => {
  const [fromDt, setFromDt] = useState('');
  const [desigs, setDesigs] = useState([]);
  const [theDesig, setTheDesig] = useState('');
  const tpContext = useContext(TPContext);
  const { postId, postDesigId, postFromDt } = tpContext.tpState;
  const { setDg, toggleDesigFlag } = tpContext;

  // to initialise lower window with context
  // the context gets filled by edit button in 
  // trail window using setter by context
  useEffect(() => {
    setTheDesig(postDesigId);
    setFromDt(postFromDt);
  }, [postDesigId, postFromDt]);

  useEffect(() => {
    const fetchData = async () => {
      reportStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/designations/short`
        );
        setDesigs(res.data);
        reportStatus('Success');
      } catch (error) {
        reportStatus('Error');
        reportMsg(errText(error));
      }
    };
    fetchData();
  }, []);

  const saveRec = async () => {
    if (theDesig == '') return;
    reportStatus('busy');
    try {
      if (postId) {
        await axios.put(`http://localhost:3000/api/tp/empDesig/${postId}`, {
          empId: theEmp, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
      } else {
        await axios.post('http://localhost:3000/api/tp/empdesig', {
          empId: theEmp, // parameter received
          desigId: theDesig, // state variable
          fromDt: fromDt, // state variable
        });
      }
      toggleDesigFlag();
      setDg('', '', '');
      reportStatus('Success');
    } catch (error) {
      reportStatus('Error');
      reportMsg(errText(error));
    }
  };


  return (
    <>
      <h5>
        <button onClick={() => setDg('', '', '')}>Add</button>
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
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
