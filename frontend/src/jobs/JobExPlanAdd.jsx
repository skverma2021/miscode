import React from 'react';
import { useState, useEffect } from 'react';
// import AddOneStage from './AddOneStage';
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
  const [errNo, setErrNo] = useState(0);

  const { id } = useParams();
  const navigate = useNavigate();

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };
  // t: {stageId, theStage, depttId, startDt, endDt, theVal}
  // arguments passed as values and not a as reference
  const okSubmit = (depttId, startDt, endDt, theVal) => {
    theVal = 5; // it would not affect the original stsges array
    if (!depttId) return false;
    if (!startDt) return false;
    if (!endDt) return false;
    if (!theVal) return false;
    if (Date.parse(endDt) - Date.parse(startDt) < 0) return false;
    return true;
  };

  // since the current row has been passed as okSubmit(t) , it is a reference

  // const okSubmit = (rec) => {
  //   if (!rec.depttId) return false;
  //   if (!rec.startDt) return false;
  //   if (!rec.endDt) return false;
  //   if (!rec.theVal) return false;
  //   if (Date.parse(rec.endDt) - Date.parse(rec.startDt) < 0) return false;
  //   return true;
  // };

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

  useEffect(() => {
    return () => clearTimeout(timeoutId);
  }, []);

  // fetches job attributes alongwith client for the header
  useEffect(() => {
    const fetchData = async () => {
      setStatus('busy');
      try {
        const res = await axios.get(
          `http://localhost:3000/api/jobs/client/${id}`
        );
        setTheJob(res.data[0]);
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(errText(error));
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getAllStages();
  }, []);

  const getAllStages = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/jobs/ExStages/${id}`
      );
      setStages(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
    }
  };

  const handleInputChange = (index, e) => {
    const newValue = e.target.value;
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[index][e.target.name] = newValue;
      return updatedStages;
    });
  };
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
  //  t: {stageId, theStage, depttId, startDt, endDt, theVal}
  const saveRec = async (stageId, depttId, startDt, endDt, theVal, toUpd) => {
    // setStatus('busy');
    try {
      if (toUpd == 0) {
        await axios.post('http://localhost:3000/api/WorkPlans', {
          jobId: id,
          stageId: stageId,
          depttId: depttId,
          schDtStart: startDt,
          schDtEnd: endDt,
          shareVal: theVal,
        });
      } else {
        await axios.put(
          `http://localhost:3000/api/WorkPlans/${id}/${stageId}`,
          {
            depttId: depttId,
            schDtStart: startDt,
            schDtEnd: endDt,
            shareVal: parseInt(theVal),
          }
        );
      }
      // setStatus('Success');
      handleSaveCount(stageId - 1);
      setRowError(stageId - 1, 0);
    } catch (error) {
      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
      setRowError(stageId - 1, 1);
    }
  };
  // const saveRec = async (rec) => {
  //   // setStatus('busy');
  //   try {
  //     if (rec.toUpd == 0) {
  //       await axios.post('http://localhost:3000/api/WorkPlans', {
  //         jobId: id,
  //         stageId: rec.stageId,
  //         depttId: rec.depttId,
  //         schDtStart: rec.startDt,
  //         schDtEnd: rec.endDt,
  //         shareVal: rec.theVal,
  //       });
  //     } else {
  //       await axios.put(
  //         `http://localhost:3000/api/WorkPlans/${id}/${rec.stageId}`,
  //         {
  //           depttId: rec.depttId,
  //           schDtStart: rec.startDt,
  //           schDtEnd: rec.endDt,
  //           shareVal: rec.theVal,
  //         }
  //       );
  //     }
  //     // setStatus('Success');
  //     handleSaveCount(rec.stageId - 1);
  //     setRowError(rec.stageId - 1, 0);
  //   } catch (error) {
  //     setStatus('Error');
  //     setMsg(errText(error));
  //     setErrNo(errNumber(error));
  //     setRowError(rec.stageId - 1, 1);
  //   }
  // };

  const bgColor = (theStage) => {
    if (theStage % 2 === 0) {
      return 'lightBlue';
    } else {
      return 'lightGray';
    }
  };

  if (status === 'Error' && errNo == 500) {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: {msg}</h1>;
  }

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '20vh',
          // height: '40vh',
          // border: '1px solid black',
          display: 'flex',
        }}
      >
        <table style={{ marginTop: '15px', lineHeight: '25px' }}>
          <tbody>
            <tr>
              <td colSpan={2}>
                Client:<b>{theJob.jobClient}</b>
              </td>
              <td></td>
            </tr>
            <tr>
              <td>
                Job:<b>{theJob.jobDes}</b>
              </td>
              <td>
                Value Rs.<b>{theJob.jobValue}</b>
              </td>
            </tr>
            <tr>
              <td>
                <i>
                  From:<u>{theJob.jobStart}</u>
                </i>
              </td>
              <td>
                <i>
                  To:<u>{theJob.jobEnd}</u>
                </i>
              </td>
            </tr>
          </tbody>
        </table>
        {/* <table style={{ marginTop: '15px', lineHeight: '25px' }}>
          <thead align='left'>
            <tr style={{ background: 'skyBlue' }}>
              <th>stageId</th>
              <th>theStage</th>
              <th>depttId</th>
              <th>startDt</th>
              <th>endDt</th>
              <th>theVal</th>
              <th>toUpd</th>
              <th>inError</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((r) => {
              return (
                <tr>
                  <td>{r.stageId}</td>
                  <td>{r.theStage}</td>
                  <td>{r.depttId}</td>
                  <td>{r.startDt}</td>
                  <td>{r.endDt}</td>
                  <td>{r.theVal}</td>
                  <td>{r.toUpd}</td>
                  <td>{r.inError}</td>
                </tr>
              );
            })}
          </tbody>
        </table> */}
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
            {/* t: {stageId, theStage, depttId, startDt, endDt, theVal} */}
            {stages.map((t) => {
              return (
                <tr
                  key={t.stageId}
                  style={{ backgroundColor: `${bgColor(t.stageId)}` }}
                >
                  <td>{t.stageId}</td>
                  <td>{t.theStage}</td>
                  <td>
                    <select
                      name='depttId'
                      id='depttId'
                      value={t.depttId || ''}
                      required
                      onChange={(e) => handleInputChange(t.stageId - 1, e)}
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
                      name='startDt'
                      id='startDt'
                      value={t.startDt || ''}
                      type='date'
                      min={theJob.jobStart}
                      max={theJob.jobEnd}
                      required
                      onChange={(e) => handleInputChange(t.stageId - 1, e)}
                      style={{
                        color: `${
                          t.inError == 1 && errNo !== 500 ? 'red' : 'black'
                        }`,
                      }}
                    />
                  </td>
                  <td>
                    <input
                      name='endDt'
                      id='endDt'
                      value={t.endDt || ''}
                      type='date'
                      min={theJob.jobStart}
                      max={theJob.jobEnd}
                      required
                      onChange={(e) => handleInputChange(t.stageId - 1, e)}
                      style={{
                        color: `${
                          t.inError == 1 && errNo !== 500 ? 'red' : 'black'
                        }`,
                      }}
                    />
                  </td>
                  <td>
                    <input
                      name='theVal'
                      id='theVal'
                      type='number'
                      value={t.theVal || ''}
                      min={0}
                      max={theJob.jobValue}
                      required
                      // a true value for (status === 'Error' && errNo !== 500) will indicate that trigger
                      // has rolled back the transaction and error has traveled from trigger to stored
                      // procedure and finally to catch block of the API call
                      style={{
                        color: `${
                          t.inError == 1 && errNo !== 500 ? 'red' : 'black'
                        }`,
                      }}
                      onChange={(e) => handleInputChange(t.stageId - 1, e)}
                    />
                  </td>
                  <td>
                    <button
                      onClick={() =>
                        saveRec(
                          t.stageId,
                          t.depttId,
                          t.startDt,
                          t.endDt,
                          t.theVal,
                          t.toUpd
                        )
                      }
                      disabled={
                        !okSubmit(t.depttId, t.startDt, t.endDt, t.theVal)
                      }
                    >
                      save
                    </button>
                    {/* <button onClick={() => saveRec(t)} disabled={!okSubmit(t)}>
                      save
                    </button> */}
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
