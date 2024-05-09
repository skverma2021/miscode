import TPContext from './TPContext';
import React, { useReducer } from 'react';
import {
  EDIT_POSTING,
  EDIT_TRANSFER,
  EDIT_RESET,
  NEW_REC_DESIG,
  UPD_REC_DESIG,
  NEW_REC_DEPTT,
  UPD_REC_DEPTT,
  REPORT_ERROR,
} from '../types';

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
      type: EDIT_POSTING,
      payLoad: { postId: edgid, postDesigId: dgid, postFromDt: edgfd },
    });
  };
  const setDp = (edpid, dpid, edpfd) => {
    dispatch({
      type: EDIT_TRANSFER,
      payLoad: { trId: edpid, trDepttId: dpid, trFromDt: edpfd },
    });
  };
  const newDesigRec = () => {
    dispatch({
      type: NEW_REC_DESIG,
      payLoad: { newRecDesig: (t) => !t },
    });
  };
  const updDesigRec = () => {
    dispatch({
      type: UPD_REC_DESIG,
      payLoad: { updRecDesig: (t) => !t },
    });
  };
  const newDepttRec = () => {
    dispatch({
      type: NEW_REC_DEPTT,
      payLoad: { newRecDeptt: (t) => !t },
    });
  };
  const updDepttRec = () => {
    dispatch({
      type: UPD_REC_DEPTT,
      payLoad: { updRecDeptt: (t) => !t },
    });
  };

  const resetTP = () => {
    dispatch({
      type: EDIT_RESET,
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
