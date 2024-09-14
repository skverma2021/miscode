import { createContext, useReducer } from 'react';
export const TPContext = createContext();

const TPReducer = (state, action) => {
  return { ...state, ...action.payLoad };
};

export const TPState = (props) => {
  const initialState = {
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

  return (
    <TPContext.Provider
      value={{
        tpState: state,
        setDg,
        setDp,

        toggleDesigFlag,
        toggleDepttFlag,

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
