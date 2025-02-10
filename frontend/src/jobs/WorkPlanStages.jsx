import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';

import { errText, errNumber } from '../util/errMsgText';
import Spinner from '../home/Spinner';
import SelectControl from '../util/SelectControl';
import GoHome from '../util/GoHome';
import { WPContext } from '../context/wp/WPContext';

const WorkPlanStages = () => {

    // State Variables  
    const [stages, setStages] = useState([]);
    const [status, setStatus] = useState('');
    const [msg, setMsg] = useState('');

    const wpContext = useContext(WPContext);
    const { jobId, jobStart, jobEnd, jobVal, deptts } = wpContext.wpState;

    // Getting all stages
    useEffect(() => {
        if (jobId) getAllStages();
    }, [jobId]);
    const getAllStages = async () => {
        setStatus('busy');
        try {
            const res = await axios.get(
                `http://localhost:3000/api/jobs/ExStages/${jobId}`
            );
            setStages(res.data);
            setStatus('Success');
        } catch (error) {
            setStatus('Error');
            setMsg(`[Error loading Stages: ${errNumber(error)} - ${errText(error)}] `);
        }
    };

    // Handling events on the form
    const sumTheVal = () => {
        let s = 0;
        for (let i = 0; i < stages.length; i++)
            s = s + parseFloat(stages[i].theVal);
        return s;
    };
    const okSubmit = (depttId, startDt, endDt, theVal) => {
        if (!depttId) return false;
        if (!startDt) return false;
        if (!endDt) return false;
        if (!theVal) return false;
        // an alternative approach to keep submit button disabled
        // if (theVal <= 0) return false;
        // if (endDt < startDt) return false;
        // if (jobVal < sumTheVal()) return false;
        return true;
    };

    // create a copy of stages array
    // update the propName property at location index with propValue
    // use third bracket [] to access property of object rec
    // returning updatedStages replaces stages array with its updated version

    const handleInputChange = (index, rec) => {
        setStages((prevStages) => {
            const updatedStages = [...prevStages];
            updatedStages[index][rec.propName] = rec.propValue;
            return updatedStages;
        });
    };
    const saveRec = async (index, stageId, depttId, startDt, endDt, theVal, toUpd) => {
        // in the next 3 tests the property inError is set to 1 and 
        // saveRec exits immediately if any one of the tests fails

        if (jobVal < sumTheVal()) {
            handleInputChange(index, {
                propName: 'inError',
                propValue: 1,
            });
            alert('Allocation exceeded the Job Value!');
            return;
        }
        if (theVal < 0) {
            handleInputChange(index, {
                propName: 'inError',
                propValue: 1,
            });
            alert('Allocation cannot be negative!');
            return;
        }
        if (endDt < startDt) {
            handleInputChange(index, {
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
            // even if it is an insert template with toUpd = 0
            // it becomes an update template after it has been saved once
            handleInputChange(index, {
                propName: 'toUpd',
                propValue: 1,
            });

            handleInputChange(index, {
                propName: 'inError',
                propValue: 0,
            });
        } catch (error) {
            // It must be a system error because user inputs have already been checked
            // So, it is time to close and navigate back to home page
            setStatus('Error');
            setMsg(`[Error saving WorkPlan: ${errNumber(error)} - ${errText(error)}] `);
        }
    };

    // User Interfaces
    if (status === 'Error') {
        return <GoHome secs={5000} msg={msg} />
    }
    if (status === 'busy') return <Spinner />;

  return (
    <>
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
              <th>Value [{sumTheVal()}]</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {stages.map((item, index) => {
              return (
                <tr key={index}>
                  <td>{item.stageId}</td>
                  <td
                    style={{
                      color: `${item.inError == 1 ? 'red' : 'black'}`,
                      fontWeight: `${item.inError == 1 ? 'bold' : 'normal'}`,
                    }}
                  >
                    {item.theStage}
                  </td>
                  <td>
                    <SelectControl
                      optionsRows={deptts}
                      selectedId={item.depttId}
                      onSelect={(d) =>
                        handleInputChange(index, {
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
                      value={item.startDt || ''}
                      type='date'
                      min={jobStart}
                      max={jobEnd}
                      required
                      onChange={(e) =>
                        handleInputChange(index, {
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
                      value={item.endDt || ''}
                      type='date'
                      min={jobStart}
                      max={jobEnd}
                      required
                      onChange={(e) =>
                        handleInputChange(index, {
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
                      value={item.theVal || ''}
                      onChange={(e) =>
                        handleInputChange(index, {
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
                          index,
                          item.stageId,
                          item.depttId,
                          item.startDt,
                          item.endDt,
                          item.theVal,
                          item.toUpd
                        )
                      }
                      type='submit'
                      disabled={
                        !okSubmit(item.depttId, item.startDt, item.endDt, item.theVal)
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
};

export default WorkPlanStages;