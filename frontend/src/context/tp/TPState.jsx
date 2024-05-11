import TPContext from './TPContext';
import React, { useReducer } from 'react';

const TPState = (props) => {

  const TPReducer = (state, action) => {
    return { ...state, ...action.payLoad };
  };

  const initialState = {
    postId: '', // empDesigId
    postDesigId: '', // desigId
    postFromDt: '', // fromDt

    trId: '', // empDepttId
    trDepttId: '', // depttId
    trFromDt: '', // fromDt

    newRecDesig: false,
    updRecDesig: false,

    newRecDeptt: false,
    updRecDeptt: false,
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
  const newDesigRec = () => {
    dispatch({
      payLoad: { newRecDesig: (t) => !t },
    });
  };
  const updDesigRec = () => {
    dispatch({
      payLoad: { updRecDesig: (t) => !t },
    });
  };
  const newDepttRec = () => {
    dispatch({
      payLoad: { newRecDeptt: (t) => !t },
    });
  };
  const updDepttRec = () => {
    dispatch({
      payLoad: { updRecDeptt: (t) => !t },
    });
  };

  const resetTP = () => {
    dispatch({
      payLoad: {
        postId: '',
        postDesigId: '',
        postFromDt: '',
        trId: '',
        trDepttId: '',
        trFromDt: '',
      },
    });
  };

  return (
    <TPContext.Provider
      value={{
        tpState: state,
        setDg,
        setDp,
        resetTP,
        newDesigRec,
        updDesigRec,
        newDepttRec,
        updDepttRec,
      }}
    >
      {props.children}
    </TPContext.Provider>
  );
};
export default TPState;
