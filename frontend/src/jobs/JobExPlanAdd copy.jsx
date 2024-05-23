import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import Spinner from '../home/Spinner';

function JobExPlanAdd() {
  const [stages, setStages] = useState([]);
  const [theJob, setTheJob] = useState({});
  const [deptts, setDeptts] = useState([]); // for dropDown to select department
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [depttStatus, setDepttStatus] = useState('');
  const [stageStatus, setStageStatus] = useState('');
  const [jobStatus, setJobStatus] = useState('');
  const [errNo, setErrNo] = useState(0);

  const { jobId } = useParams();
  const navigate = useNavigate();

  const sumTheVal = ()=>{
    let s=0;
    for (let i=0; i < stages.length; i++) s = s + parseFloat(stages[i].theWpAllottedAmt)
    return s;
  }

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  // t: {stageId, theStage, depttId, startDt, endDt, theVal}
  // theWpDepttId, theExStage, theStageId, theWpDepttName, theSchStart, theSchEnd, theWpAllottedAmt, theWpUsedAmt
  // arguments passed as values and not a as reference
  const okSubmit = (theWpDepttId, theSchStart, theSchEnd, theWpAllottedAmt) => { 
    if (!theWpDepttId) return false;
    if (!theSchStart) return false;
    if (!theSchEnd) return false;
    if (!theWpAllottedAmt) return false;
    if (Date.parse(theSchEnd) - Date.parse(theSchStart) < 0) return false;
    return true;
  };

  // since the current row (t) can be passed as okSubmit(t) in which case it would be a reference

  // const okSubmit = (rec) => {
  //   if (!rec.theWpDepttId) return false;
  //   if (!rec.theSchStart) return false;
  //   if (!rec.theSchEnd) return false;
  //   if (!rec.theWpAllottedAmt) return false;
  //   if (Date.parse(rec.theSchEnd) - Date.parse(rec.theSchStart) < 0) return false;
  //   return true;
  // };

  useEffect(() => {
    setDepttStatus('busy');
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/api/departments`);
        setDeptts(res.data);
        setDepttStatus('Success');
      } catch (error) {
        setDepttStatus('Error');
        setMsg(errText(error));
        // setErrNo(500);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // fetches job attributes alongwith client for the header
  useEffect(() => {
    const fetchData = async () => {
      setJobStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/jobs/client/${jobId}`
        );
        setTheJob(res.data[0]);
        setJobStatus('Success');
      } catch (error) {
        setJobStatus('Error');
        setMsg(errText(error));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getAllStages();
  }, []);

  // Note:
  // if there are no workPlans belonging to the jobId, 
  // theStageId and theExStage will have values pulled from jobExStages,
  // toUpd, inError, and theWpAllottedAmt will be 0,
  // and theWpDepttId, theSchStart, and theSchEnd will be NULL

  const getAllStages = async () => {
    setStageStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/workplans/${jobId}`
      );
      setStages(res.data);
      setStageStatus('Success');
    } catch (error) {
      setStageStatus('Error');
      setMsg(errText(error));
    }
  };

  // All stages have been pulled from jobExStages
  // where theStageId starts with 1 and goes up to 10
  // the parameter index has been passed after deducting 1 from theStageId
  const handleInputChange = (index, e) => {
    const newValue = e.target.value;
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      // third bracket makes it property name
      updatedStages[index][e.target.name] = newValue;
      return updatedStages;
    });
  };
  
  // even if it is an insert case with toUpd = 0
  // it qualifies for update after saving once
  const handleSaveCount = (index) => {
    // const newValue = e.target.value;
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[index].toUpd = updatedStages[index].toUpd + 1;
      return updatedStages;
    });
  };
  const setRowError = (index, val) => {
    // const newValue = e.target.value;
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[index].inError = val;
      return updatedStages;
    });
  };

  //  t: {theStageId, theExStage, theWpDepttId, theSchStart, theSchEnd, theWpAllottedAmt}
  const saveRec = async (theStageId, theWpDepttId, theSchStart, theSchEnd, theWpAllottedAmt, toUpd) => {
    // console.log(theJob.jobValue, sumTheVal());
    if (theJob.jobValue < sumTheVal() ) {
      // setStatus('Error');
      // 1 indicates Error
      setRowError(theStageId - 1, 1);
      return;
    }
    setStatus('busy');
    try {
      if (toUpd == 0) {
        await axios.post('http://localhost:3000/api/workplans', {
          // jobId, stageId, depttId, schDtStart, schDtEnd, shareVal
          jobId: jobId,
          stageId: theStageId,
          depttId: theWpDepttId,
          schDtStart: theSchStart,
          schDtEnd: theSchEnd,
          shareVal: parseInt(theWpAllottedAmt),
        });
      } else {
        await axios.put(
          `http://localhost:3000/api/workplans/${jobId}/${theStageId}`,
          {
            // jobId, stageId, depttId, schDtStart, schDtEnd, shareVal
            depttId: theWpDepttId,
            schDtStart: theSchStart,
            schDtEnd: theSchEnd,
            shareVal: parseInt(theWpAllottedAmt),
          }
        );
      }
      setStatus('Success');
      handleSaveCount(theStageId - 1);
      // 0 indicates No Error
      setRowError(theStageId - 1, 0);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));

      // 1 indicates Error
      setRowError(theStageId - 1, 1);
    }
  };

  const bgColor = (theStageId) => {
    if (theStageId % 2 === 0) {
      return 'lightBlue';
    } else {
      return 'lightGray';
    }
  };

  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>System Error ({errNo}): {msg}</h1>;
  }
  if (depttStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Departments could not be loaded</h1>;
  }
  if (stageStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Stages could not be loaded</h1>;
  }
  if (jobStatus === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: the Job could not be loaded</h1>;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '20vh',
          display: 'flex',
        }}
      >
        <table style={{ marginTop: '15px', lineHeight: '25px' }}>
          <tbody>
            <tr>
              <td colSpan={2}>Client:<b>{theJob.jobClient}</b></td>
              <td></td>
            </tr>
            <tr>
              <td>Job:<b>{theJob.jobDes}</b></td>
              <td>Value Rs.<b>{theJob.jobValue}/[Allocated:{sumTheVal()}]</b></td>
            </tr>
            <tr>
              <td><i>From:<u>{theJob.jobStart}</u></i></td>
              <td><i>To:<u>{theJob.jobEnd}</u></i></td>
            </tr>
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '40px',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <table
          style={{
            lineHeight: '40px',
            border: '1px solid black',
            width: '100%',
          }}
        >
          <thead align='left'>
            <tr style={{ background: 'skyBlue' }}>
              <th>SL</th>
              <th>Stage</th>
              <th>Department</th>
              <th>Date [start]</th>
              <th>Date [End]</th>
              <th>Value</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* t: {theStageId, theExStage, theWpDepttId, theSchStart, theSchEnd, theWpAllottedAmt} */}
            {stages.map((t) => {
              return (
                <tr
                  key={t.theStageId}
                  style={{ backgroundColor: `${bgColor(t.theStageId)}` }}
                >
                  <td>{t.theStageId}</td>
                  <td>{t.theExStage}</td>
                  <td>
                    <select
                      name='theWpDepttId'
                      id='theWpDepttId'
                      value={t.theWpDepttId || ''}
                      required
                      onChange={(e) => handleInputChange(t.theStageId - 1, e)}
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
                      name='theSchStart'
                      id='theSchStart'
                      value={t.theSchStart || ''}
                      type='date'
                      min={theJob.jobStart}
                      max={theJob.jobEnd}
                      required
                      onChange={(e) => handleInputChange(t.theStageId - 1, e)}
                      // style={{
                      //   color: `${
                      //     t.inError == 1  ? 'red' : 'black'
                      //   }`,
                      // }}
                    />
                  </td>
                  <td>
                    <input
                      name='theSchEnd'
                      id='theSchEnd'
                      value={t.theSchEnd || ''}
                      type='date'
                      min={theJob.jobStart}
                      max={theJob.jobEnd}
                      required
                      onChange={(e) => handleInputChange(t.theStageId - 1, e)}
                      // style={{
                      //   color: `${
                      //     t.inError == 1 ? 'red' : 'black'
                      //   }`,
                      // }}
                    />
                  </td>
                  <td>
                    <input
                      name='theWpAllottedAmt'
                      id='theWpAllottedAmt'
                      type='number'
                      value={t.theWpAllottedAmt || ''}
                      min={0}
                      max={theJob.jobValue}
                      required
                      // a true value for (status === 'Error' && errNo !== 500) will indicate that trigger
                      // has rolled back the transaction and error has traveled from trigger to stored
                      // procedure and finally to catch block of the API call
                      style={{
                        color: `${
                          t.inError == 1  ? 'red' : 'black'
                        }`,
                        fontWeight:`${
                          t.inError == 1  ? 'bold' : 'normal'
                        }`
                        
                      }}
                      onChange={(e) => handleInputChange(t.theStageId - 1, e)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        saveRec(
                          t.theStageId,
                          t.theWpDepttId,
                          t.theSchStart,
                          t.theSchEnd,
                          t.theWpAllottedAmt,
                          t.toUpd
                        )
                      }
                      disabled={
                        !okSubmit(t.theWpDepttId, t.theSchStart, t.theSchEnd, t.theWpAllottedAmt)
                      }
                    >
                      save
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default JobExPlanAdd;
