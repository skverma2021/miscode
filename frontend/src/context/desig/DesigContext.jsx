import React, { useReducer } from 'react';

import { createContext } from 'react';
export const DesigContext = createContext();

// The reducer function
const DesigReducer = (state, action) => {
  return { ...state, ...action.payLoad };
};

export const DesigState = (props) => {
  const initialState = {
    discpId: 0,
    discp: '',

    desigId: 0,
    desigDes: '',
    desigGrade: '',

    delFlag: false,
    addEditFlag: false,
    status: '',
    msg: '',
  };

  const [state, dispatch] = useReducer(DesigReducer, initialState);

  const setDiscp = (id, des) => {
    dispatch({
      payLoad: { discpId: id, discp: des },
    });
  };
  const setDesig = (id, des, grade) => {
    dispatch({
      payLoad: { desigId: id, desigDes: des, desigGrade: grade },
    });
  };

  const setDelFlag = () => {
    dispatch({
      payLoad: { delFlag: (t) => !t },
    });
  };
  const setAddEditFlag = () => {
    dispatch({
      payLoad: { addEditFlag: (t) => !t },
    });
  };

  const setStatus = (theText) => {
    dispatch({
      payLoad: { status: theText },
    });
  };

  const setMsg = (theText) => {
    dispatch({
      payLoad: { msg: theText },
    });
  };

  const getStatus = () => {
    return state.status;
  };

  const getMsg = () => {
    return state.msg;
  };

  return (
    <DesigContext.Provider
      value={{
        discpId: state.discpId,
        discp: state.discp,

        desigId: state.desigId,
        desigDes: state.desigDes,
        desigGrade: state.desigGrade,

        addEditFlag: state.addEditFlag,
        setAddEditFlag,
        delFlag: state.delFlag,
        setDelFlag,

        setDiscp,
        setDesig,

        setStatus,
        setMsg,
        getStatus,
        getMsg,
      }}
    >
      {props.children}
    </DesigContext.Provider>
  );
};
