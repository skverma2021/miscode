import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { TPContext } from '../context/tp/TPContext';
import { errText } from '../util/errMsgText';
import SelectControl from '../util/SelectControl';

const Posting = () => {
  // theDesig and fromDt are for input controls in the form
  const [theDesig, setTheDesig] = useState('');
  const [fromDt, setFromDt] = useState('');

  // desigs is for select control
  const [desigs, setDesigs] = useState([]);

  const tpContext = useContext(TPContext);
  const { postId, postDesigId, postFromDt, empId } = tpContext.tpState;
  const { setDg, toggleDesigFlag, setStatus, setMsg } = tpContext;

  // to initialise lower window with context
  // the context gets filled by edit button in
  // trail window using setter by context
  useEffect(() => {
    setTheDesig(postDesigId);
    setFromDt(postFromDt);
  }, [postDesigId, postFromDt]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/designations/select`
        );
        setDesigs(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
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
      toggleDesigFlag();
      setDg('', '', '');
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  return (
    <>
      <h5>
        <button onClick={() => setDg('', '', '')}>Add</button>
      </h5>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex' }}>
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
          <button onClick={saveRec}>Save</button>
        </div>
      </div>
    </>
  );
};

export default Posting;
