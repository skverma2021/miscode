import React from 'react';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { WPContext } from '../context/wp/WPContext';
import { useParams } from 'react-router-dom';
import { errText, errNumber } from '../util/errMsgText';
import WorkPlanJob from './WorkPlanJob';
import WorkPlanStages from './WorkPlanStages';
import GoHome from '../util/GoHome';
import Spinner from '../home/Spinner';

function WorkPlan() {

  // State Variables  
  // const [deptts, setDeptts] = useState([]); // for dropDown to select department
  const wpContext = useContext(WPContext);
  const { setJob, setDepartments } = wpContext;

  const [status, setStatus] = useState('');
  const [msg, setMsg] = useState('');

  // set the context with job ID
  const { jobId } = useParams();
  useEffect(() => {
    setJob(jobId)
  }, [jobId]);

  // Departments
  useEffect(() => {
    setStatus('busy');
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/api/departments/select`
        );
        // setDeptts(res.data);
        setDepartments(res.data)
        setStatus('Success');
      } catch (error) {
        setStatus('Error');
        setMsg(`[Error loading departments: ${errNumber(error)} - ${errText(error)}] `);
      }
    };
    fetchData();
  }, []);

  // User Interfaces
  if (status === 'Error') {
    return <GoHome secs={5000} msg={msg} />
  }
  if (status === 'busy') return <Spinner />;

  return (
    <>
      <WorkPlanJob />
      <WorkPlanStages />
    </>
  );
}

export default WorkPlan;
