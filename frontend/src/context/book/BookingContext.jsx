import { createContext, useReducer } from 'react';
export const BookingContext = createContext();

const BookingReducer = (state, action) => {
  return { ...state, ...action.payLoad };
};

export const BookingState = (props) => {
  const initialState = {
    postId: '', // empDesigId
    postDesigId: '', // desigId
    postFromDt: '', // fromDt

    trId: '', // empDepttId
    trDepttId: '', // depttId
    trFromDt: '', // fromDt

    desigFlag: false,
    depttFlag: false,
  };

  const [state, dispatch] = useReducer(BookingReducer, initialState);

  const setDg = (edgid, dgid, edgfd) => {
    dispatch({
      payLoad: { postId: edgid, postDesigId: dgid, postFromDt: edgfd },
    });
  };
  const setDp = (edpid, dpid, edpfd) => {
    dispatch({
      payLoad: { trId: edpid, trDepttId: dpid, trFromDt: edpfd },
    });
  };

  const toggleDesigFlag = () => {
    dispatch({
      payLoad: { desigFlag: (t) => !t },
    });
  };

  const toggleDepttFlag = () => {
    dispatch({
      payLoad: { depttFlag: (t) => !t },
    });
  };

  return (
    <BookingContext.Provider
      value={{
        tpState: state,
        setDg,
        setDp,

        toggleDesigFlag,
        toggleDepttFlag,
      }}
    >
      {props.children}
    </BookingContext.Provider>
  );
};
