import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { errText, errNumber } from '../util/errMsgText';
import { useNavigate, useParams } from 'react-router-dom';
import SelectControl from '../util/SelectControl';
import Spinner from '../home/Spinner';

function JobExPlanAdd() {
  const [stages, setStages] = useState([]);
  const [theJob, setTheJob] = useState({});
  const [deptts, setDeptts] = useState([]); // for dropDown to select department
  const [msg, setMsg] = useState('');
  const [status, setStatus] = useState('');
  const [errNo, setErrNo] = useState(0);

  const { jobId } = useParams();
  const navigate = useNavigate();

  const sumTheVal = () => {
    let s = 0;
    for (let i = 0; i < stages.length; i++)
      s = s + parseFloat(stages[i].theVal);
    return s;
  };

  let timeoutId;
  const goHome = () => {
    navigate('/');
  };

  // t: {stageId, theStage, depttId, startDt, endDt, theVal}
  // arguments passed as values and not a as reference
  const okSubmit = (depttId, startDt, endDt, theVal) => {
    if (!depttId) return false;
    if (!startDt) return false;
    if (!endDt) return false;
    if (!theVal) return false;
    return true;
  };

  // fetch Departments
  useEffect(() => {
    setStatus('busy');
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/departments/select`
        );
        setDeptts(res.data);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-Deptt');
        setMsg(errText(error));
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
          `http://localhost:3000/api/jobs/client/${jobId}`
        );
        setTheJob(res.data[0]);
        setStatus('Success');
      } catch (error) {
        setStatus('Error-Job');
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
  // stageId and theStage will still have values pulled from jobExStages,
  // toUpd, inError, and theVal will be 0,
  // and depttId, startDt, and endDt will be NULL

  const getAllStages = async () => {
    setStatus('busy');
    try {
      const res = await axios.get(
        `http://localhost:3000/api/jobs/ExStages/${jobId}`
      );
      setStages(res.data);
      setStatus('Success');
    } catch (error) {
      setStatus('Error-Stages');
      setMsg(errText(error));
    }
  };

  // All stages have been pulled from jobExStages
  // where stageId starts with 1 and goes up to 10
  // the parameter index has been passed after deducting 1 from stageId

  // create a copy of stages
  // update the propName property at location index with propValue
  // use third bracket [] to access property of object rec
  // returning updatedStages replaces stages with its updated version

  const handleInputChange = (index, rec) => {
    setStages((prevStages) => {
      const updatedStages = [...prevStages];
      updatedStages[index][rec.propName] = rec.propValue;
      return updatedStages;
    });
  };

  // even if it is an insert case with toUpd = 0
  // it qualifies for update after it has been saved once

  const saveRec = async (stageId, depttId, startDt, endDt, theVal, toUpd) => {
    //  t: {stageId, theStage, depttId, startDt, endDt, theVal}
    // in the next 3 tests the property inError is set to 1 and saveRec exits immediately
    // if any one of the tests fails
    // stageId-1 is required because stages is an array and starts with 0
    // 1 indicates Error

    if (theJob.jobValue < sumTheVal()) {
      handleInputChange(stageId - 1, {
        propName: 'inError',
        propValue: 1,
      });
      alert('Allocation exceeded the Job Value!');
      return;
    }
    if (theVal < 0) {
      handleInputChange(stageId - 1, {
        propName: 'inError',
        propValue: 1,
      });
      alert('Allocation cannot be negative!');
      return;
    }
    if (endDt < startDt) {
      handleInputChange(stageId - 1, {
        propName: 'inError',
        propValue: 1,
      });
      alert('Job cannot end before it has started!');
      return;
    }

    setStatus('busy');
    try {
      if (toUpd == 0) {
        await axios.post('http://localhost:3000/api/workplans', {
          jobId: jobId,
          stageId: stageId,
          depttId: depttId,
          schDtStart: startDt,
          schDtEnd: endDt,
          shareVal: theVal,
        });
      } else {
        await axios.put(
          `http://localhost:3000/api/workplans/${jobId}/${stageId}`,
          {
            depttId: depttId,
            schDtStart: startDt,
            schDtEnd: endDt,
            shareVal: parseInt(theVal),
          }
        );
      }
      setStatus('Success');
      // now it is time to make toUpd = 1 and inError = 0
      handleInputChange(stageId - 1, {
        propName: 'toUpd',
        propValue: 1,
      });
      handleInputChange(stageId - 1, {
        propName: 'inError',
        propValue: 0,
      });
    } catch (error) {
      // It must be a system error because user inputs have already been checked
      // Now it is time to close and navigate back to home page

      setStatus('Error');
      setMsg(errText(error));
      setErrNo(errNumber(error));
    }
  };

  const bgColor = (theStage) => {
    if (theStage % 2 === 0) {
      return 'lightBlue';
    } else {
      return 'lightGray';
    }
  };

  if (status === 'Error') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>
        System Error ({errNo}): {msg}
      </h1>
    );
  }
  if (status === 'Error-Deptt') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>Error: Departments could not be loaded</h1>
    );
  }
  if (status === 'Error-Stages') {
    timeoutId = setTimeout(goHome, 5000);
    return <h1 style={{ color: 'red' }}>Error: Stages could not be loaded</h1>;
  }
  if (status === 'Error-Job') {
    timeoutId = setTimeout(goHome, 5000);
    return (
      <h1 style={{ color: 'red' }}>
        Error: the Job Details could not be loaded
      </h1>
    );
  }

  if (status === 'busy') return <Spinner />;

  return (
    <>
      <div
        style={{
          width: '100%',
          height: '15vh',
          display: 'flex',
        }}
      >
        <table
          style={{
            marginTop: '15px',
            lineHeight: '25px',
          }}
        >
          <tbody>
            <tr>
              <td>Client:</td>
              <td>
                <b>{theJob.jobClient}</b>
              </td>
            </tr>
            <tr>
              <td>Job:</td>
              <td>
                <b>{theJob.jobDes}</b>
              </td>
            </tr>
            <tr>
              <td>Value Rs.</td>
              <td>
                {' '}
                <b>
                  {theJob.jobValue}/[Allocated:{sumTheVal()}]
                </b>
              </td>
            </tr>
            <tr>
              <td>From:</td>
              <td>
                <b>
                  <u>{theJob.jobStart}</u>
                </b>
                {` to `}
                <b>
                  <u>{theJob.jobEnd}</u>
                </b>
              </td>
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
            {/* t: {stageId, theStage, depttId, startDt, endDt, theVal} */}
            {stages.map((t) => {
              return (
                <tr key={t.stageId}>
                  <td>{t.stageId}</td>
                  <td
                    style={{
                      color: `${t.inError == 1 ? 'red' : 'black'}`,
                      fontWeight: `${t.inError == 1 ? 'bold' : 'normal'}`,
                    }}
                  >
                    {t.theStage}
                  </td>
                  <td>
                    <SelectControl
                      optionsRows={deptts}
                      selectedId={t.depttId}
                      onSelect={(d) =>
                        handleInputChange(t.stageId - 1, {
                          propName: 'depttId',
                          propValue: d,
                        })
                      }
                      prompt={'Department'}
                    />
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
                      onChange={(e) =>
                        handleInputChange(t.stageId - 1, {
                          propName: 'startDt',
                          propValue: e.target.value,
                        })
                      }
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
                      onChange={(e) =>
                        handleInputChange(t.stageId - 1, {
                          propName: 'endDt',
                          propValue: e.target.value,
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      name='theVal'
                      id='theVal'
                      type='number'
                      value={t.theVal || ''}
                      onChange={(e) =>
                        handleInputChange(t.stageId - 1, {
                          propName: 'theVal',
                          propValue: e.target.value,
                        })
                      }
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
                      type='submit'
                      disabled={
                        !okSubmit(t.depttId, t.startDt, t.endDt, t.theVal)
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
