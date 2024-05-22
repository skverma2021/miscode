import React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function JobExPlan() {
  // theExStage, theStageId, theWpDepttName, theSchStart, theSchEnd, theWpAllottedAmt, theWpUsedAmt
  const [stages, setStages] = useState([]);
  const [theJob, setTheJob] = useState({});
  const { jobId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/jobs/client/${jobId}`
        );
        setTheJob(res.data[0]);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    getAllStages();
  }, []);

  const getAllStages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/workplans/${jobId}`
      );
      setStages(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const bgColor = (theStage) => {
    if (theStage % 2 === 0) {
      return 'lightBlue';
    } else {
      return 'lightGray';
    }
  };

  return (
    <>
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
              <th>Alloted</th>
              <th>Consumed</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* theExStage, theStageId, theWpDepttName, theSchStart, theSchEnd, theWpAllottedAmt, theWpUsedAmt */}
            {stages.map((t) => {
              return (
                <tr
                  key={t.theStageId}
                  style={{ backgroundColor: `${bgColor(t.theStageId)}` }}
                >
                  <td>{t.theStageId}</td>
                  <td>{t.theExStage}</td>
                  <td>{t.theWpDepttName}</td>
                  <td>{t.theSchStart}</td>
                  <td>{t.theSchEnd}</td>
                  <td>{t.theWpAllottedAmt}</td>
                  <td>{t.theWpUsedAmt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default JobExPlan;
