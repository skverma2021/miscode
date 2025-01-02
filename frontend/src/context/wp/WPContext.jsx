import { createContext, useState } from 'react';

export const WPContext = createContext();

export const WPState = (props) => {
  const [jobId, setJobId] = useState('');
  const [jobStart, setJobStart] = useState('');
  const [jobEnd, setJobEnd] = useState('');
  const [jobVal, setJobVal] = useState('');
  const [deptts, setDeptts] = useState([]);

  const setJob = (theJobId) => {
    setJobId(theJobId);
  };

  const setJobTimeline = (theJobStart, theJobEnd) => {
    setJobStart(theJobStart);
    setJobEnd(theJobEnd);
  };

  const setJobValHandler = (theJobVal) => {
    setJobVal(theJobVal);
  };

  const setDepartments = (theDepartmentList) => {
    setDeptts(theDepartmentList);
  };

  return (
    <WPContext.Provider
      value={{
        wpState: { jobId, jobStart, jobEnd, jobVal, deptts },
        setJob,
        setJobTimeline,
        setJobVal: setJobValHandler,
        setDepartments,
      }}
    >
      {props.children}
    </WPContext.Provider>
  );
};
