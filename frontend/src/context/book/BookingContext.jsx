import { createContext, useReducer } from 'react';
export const BookingContext = createContext();

// const BookingReducer = (state, action) => {
//   return { ...state, ...action.payload };
// };

const BookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_EMP':
      return { ...state, empId: action.payload.empId};
    case 'SET_HOURLY_RATE':
      return { ...state, hourlyRate: action.payload.hourlyRate };
    case 'SET_MONTH':
      return { ...state, month: action.payload.month };
    case 'SET_YEAR':
      return { ...state, year: action.payload.year };
    default:
      return state;
  }
};

export const BookingState = (props) => {
  const initialState = {
    empId:'',
    hourlyRate:'',

    month:'',
    year:'',

  };

  const [state, dispatch] = useReducer(BookingReducer, initialState);

  const setEmpId = (theEmp) => {
    dispatch({
      type: 'SET_EMP', payload: { empId: theEmp },
    });
  };
  const setHourlyRate = (theHRate) => {
    dispatch({
      type: 'SET_HOURLY_RATE',payload: { hourlyRate: theHRate },
    });
  };
  const setMonth = (theMonth) => {
    dispatch({
      type: 'SET_MONTH',payload: { month: theMonth },
    });
  };
  const setYear = (theYear) => {
    dispatch({
      type: 'SET_YEAR',payload: { year: theYear },
    });
  };

  return (
    <BookingContext.Provider
      value={{
        bookingState: state,
        setEmpId,
        setHourlyRate,
        setMonth,
        setYear,
      }}
    >
      {props.children}
    </BookingContext.Provider>
  );
};
