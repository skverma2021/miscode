import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate } from 'react-router-dom';
import Spinner from '../home/Spinner';

const AddOneStage = (props) => {
  // props: {stageId, theStage, depttId, startDt, endDt, theVal} - workPlan
  // props: theVal: department's share in the job value as per workPlan
  // props: {theJob, jobStartDt, jobEndDt, jobVal, saveCount} - to ensure valid start and finish date which should remain within job
  // props: {theJob, jobStartDt, jobEndDt, jobVal, saveCount} - department's share is controlled by a trigger
  // props: saveCount: 1 when workPlan exists ie when depttId is not null, 0 otherwise
  // props: reportError is a function which sets status and msg in the parent component
  const {
    stageId,
    theStage,
    depttId,
    startDt,
    endDt,
    theVal,

    theJob,
    jobStartDt,
    jobEndDt,
    jobValue,
    saveCount,
  } = props;

  const [theDeptt, setTheDeptt] = useState(depttId);
  const [deptts, setDeptts] = useState([]); // for dropDown to select department
  const [theStart, setTheStart] = useState(startDt);
  const [theEnd, setTheEnd] = useState(endDt);
  const [stageVal, setStageVal] = useState(theVal);
  const [errNo, setErrNo] = useState(0);
  const [count, setCount] = useState(saveCount);
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

  const okSubmit = () => {
    if (!theDeptt) return false;
    if (!theStart) return false;
    if (!theEnd) return false;
    if (!stageVal) return false;
    if (Date.parse(theEnd) - Date.parse(theStart) < 0) return false;
    return true;
  };

  useEffect(() => {
    setStatus('busy');
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/departments`);
        setDeptts(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
        setErrNo(500);
      }
    };
    fetchData();
  }, []);

  const handleDepttChange = (e) => {
    setTheDeptt(e.target.value);
  };
  const handleDtStartChange = (e) => {
    setTheStart(e.target.value);
  };
  const handleDtEndChange = (e) => {
    setTheEnd(e.target.value);
  };
  const handleShareValChange = (e) => {
    setStageVal(e.target.value);
  };

  const saveRec = async (event) => {
    setStatus('busy');
    event.preventDefault();
    try {
      if (count == 0) {
        await axios.post('http://localhost:3000/api/WorkPlans', {
          jobId: theJob,
          stageId: stageId,
          depttId: theDeptt,
          schDtStart: theStart,
          schDtEnd: theEnd,
          shareVal: stageVal,
        });
      } else {
        await axios.put(
          `http://localhost:3000/api/WorkPlans/${theJob}/${stageId}`,
          {
            depttId: theDeptt,
            schDtStart: theStart,
            schDtEnd: theEnd,
            shareVal: stageVal,
          }
        );
      }
      setStatus('Success');
      setCount(count + 1);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  if (status === 'Error' && errNo === 500) {
    timeoutId = setTimeout(goHome, 500);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  // if (status === 'busy') return <Spinner />;

  return (
    <>
      <td>{stageId}</td>
      <td>{theStage}</td>
      <td>
        <select
          name='depttId'
          id='depttId'
          value={theDeptt || ''}
          required
          onChange={handleDepttChange}
        >
          <option value=''>Select Deptt</option>
          {deptts.map((d) => {
            return (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            );
          })}
        </select>
      </td>
      <td>
        <input
          value={theStart || ''}
          type='date'
          min={jobStartDt}
          max={jobEndDt}
          required
          onChange={handleDtStartChange}
          style={{
            color: `${status === 'Error' && errNo !== 500 ? 'red' : 'black'}`,
          }}
        />
      </td>
      <td>
        <input
          value={theEnd || ''}
          type='date'
          min={jobStartDt}
          max={jobEndDt}
          required
          onChange={handleDtEndChange}
          style={{
            color: `${status === 'Error' && errNo !== 500 ? 'red' : 'black'}`,
          }}
        />
      </td>
      <td>
        <input
          type='number'
          value={stageVal || ''}
          name='stageVal'
          min={0}
          max={jobValue}
          required
          // a true value for (status === 'Error' && errNo !== 500) will indicate that trigger
          // has rolled back the transaction and error has traveled from trigger to stored
          // procedure and finally to catch block of the API call
          style={{
            color: `${status === 'Error' && errNo !== 500 ? 'red' : 'black'}`,
          }}
          onChange={handleShareValChange}
        />
      </td>
      <td>
        <button onClick={saveRec} disabled={!okSubmit()}>
          save
        </button>
      </td>
    </>
  );
};

export default AddOneStage;
