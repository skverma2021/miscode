import { createContext, useReducer } from 'react';
export const TPContext = createContext();

const TPReducer = (state, action) => {
  return { ...state, ...action.payLoad };
};

export const TPState = (props) => {
  const initialState = {
    empId: '',

    postId: '', // empDesigId
    postDesigId: '', // desigId
    postFromDt: '', // fromDt

    trId: '', // empDepttId
    trDepttId: '', // depttId
    trFromDt: '', // fromDt

    desigFlag: false,
    depttFlag: false,

    status: '',
    msg: '',
  };

  const [state, dispatch] = useReducer(TPReducer, initialState);

  // detDg for set empDesig details
  const setDg = (edgid, dgid, edgfd) => {
    dispatch({
      payLoad: { postId: edgid, postDesigId: dgid, postFromDt: edgfd },
    });
  };

  // detDt for set empDeptt details
  const setDt = (edtid, dtid, edtfd) => {
    dispatch({
      payLoad: { trId: edtid, trDepttId: dtid, trFromDt: edtfd },
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

  const setStatus = (theTxt) => {
    dispatch({
      payLoad: { status: theTxt },
    });
  };
  const setMsg = (theTxt) => {
    dispatch({
      payLoad: { msg: theTxt },
    });
  };
  const getStatus = () => {
    return state.status;
  };
  const getMsg = () => {
    return state.msg;
  };

  const setEmp = (theTxt) => {
    dispatch({
      payLoad: { empId: theTxt },
    });
  };

  return (
    <TPContext.Provider
      value={{
        tpState: state,
        setDg,
        setDt,

        toggleDesigFlag,
        toggleDepttFlag,

        setEmp,
        setStatus,
        getStatus,
        setMsg,
        getMsg,
      }}
    >
      {props.children}
    </TPContext.Provider>
  );
};
