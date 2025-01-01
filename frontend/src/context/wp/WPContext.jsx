import { createContext, useReducer } from 'react';
export const WPContext = createContext();

const WPReducer = (state, action) => {
  switch (action.type) {
    case 'SET_JOB':
      return { ...state, jobId: action.payload.jobId};
    case 'SET_JOB_TIMELINE':
      return { ...state, jobStart: action.payload.jobStart, jobEnd: action.payload.jobEnd };
    case 'SET_JOB_VAL':
      return { ...state, jobVal: action.payload.jobVal };
    case 'SET_DEPARTMENTS':
      return { ...state, deptts: action.payload.deptts };
    default:
      return state;
  }
};

export const WPState = (props) => {
  const initialState = {
    jobId: '',

    jobStart: '', 
    jobEnd: '', 

    jobVal: '', 
    deptts:[]

  };

  const [state, dispatch] = useReducer(WPReducer, initialState);

  const setJob = (theJobId) => {
    dispatch({ type: 'SET_JOB',payload: { jobId: theJobId },
    });
  };

  const setJobTimeline = (theJobStart, theJobEnd) => {
    dispatch({ type: 'SET_JOB_TIMELINE', payload: { jobStart: theJobStart, jobEnd: theJobEnd },
    });
  };

  const setJobVal = (theJobVal) => {
      dispatch({ type: 'SET_JOB_VAL', payload: {jobVal: theJobVal },
      });
    };
  const setDepartments = (theDepartmentList) => {
      dispatch({ type: 'SET_DEPARTMENTS', payload: {deptts: theDepartmentList },
      });
    };

  return (
    <WPContext.Provider
      value={{
        wpState: state,
        
        setJob,
        setJobTimeline,
        setJobVal,
        setDepartments,
      }}
    >
      {props.children}
    </WPContext.Provider>
  );
};
