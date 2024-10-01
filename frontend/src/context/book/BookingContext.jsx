import { createContext, useReducer } from 'react';
export const BookingContext = createContext();

const BookingReducer = (state, action) => {
  return { ...state, ...action.payLoad };
};

export const BookingState = (props) => {
  const initialState = {
    bStatus: '',
    bMsg: '',
  };

  const [state, dispatch] = useReducer(BookingReducer, initialState);

  const setBStatus = (theTxt) => {
    dispatch({
      payLoad: { bStatus: theTxt },
    });
  };
  const setBMsg = (theTxt) => {
    dispatch({
      payLoad: { bMsg: theTxt },
    });
  };
  const getBStatus = () => {
    return state.bStatus;
  };
  const getBMsg = () => {
    return state.bMsg;
  };

  return (
    <BookingContext.Provider
      value={{
        setBStatus,
        getBStatus,
        setBMsg,
        getBMsg,
      }}
    >
      {props.children}
    </BookingContext.Provider>
  );
};
