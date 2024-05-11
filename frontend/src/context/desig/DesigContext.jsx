import { createContext } from 'react';
import React, { useReducer } from 'react';

export const DesigContext = createContext();

export const DesigState = (props) => {
  
  const DesigReducer = (state, action) => {
  return { ...state, ...action.payLoad };
  };

  const initialState = {
    discpId:'',
    discp:'',

    desigId:'',
    desigDes:'',
    desigGrade:'',

    delFlag:false,
    addEditFlag:false,
  };
  
  const [state, dispatch] = useReducer(DesigReducer, initialState);

  const setDiscp = (id, des) =>{
    dispatch({
      payLoad:{discpId:id, discp:des}
    })
  }
  const setDesig = (id, des, grade) =>{
    dispatch({
      payLoad:{desigId:id, desigDes:des, desigGrade:grade}
    })
  }

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

  return (
    <DesigContext.Provider
      value={{
        desigState: state,
        setDiscp,
        setDesig,
        setDelFlag,
        setAddEditFlag
      }}
    >
      {props.children}
    </DesigContext.Provider>
  );
};
