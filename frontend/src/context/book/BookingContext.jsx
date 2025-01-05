import { createContext, useState } from 'react';
export const BookingContext = createContext();

export const BookingState = (props) => {
  const initialState = {
    empId: '',
    hourlyRate: '',
    month: '',
    year: '',
  };

  const [state, setState] = useState(initialState);

  const setEmpId = (theEmp) => {
    setState((prevState) => ({
      ...prevState,
      empId: theEmp,
    }));
  };

  const setHourlyRate = (theHRate) => {
    setState((prevState) => ({
      ...prevState,
      hourlyRate: theHRate,
    }));
  };

  const setMonth = (theMonth) => {
    setState((prevState) => ({
      ...prevState,
      month: theMonth,
    }));
  };

  const setYear = (theYear) => {
    setState((prevState) => ({
      ...prevState,
      year: theYear,
    }));
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
