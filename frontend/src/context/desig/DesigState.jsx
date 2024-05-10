import DesigContext from './DesigContext';
import React, { useReducer } from 'react';
import {
  SET_DISCP,
  SET_DESIG,
  NEW_DEL,
  NEW_ADD_EDIT
} from '../types';

const DesigState = (props) => {

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
      type: SET_DISCP,
      payLoad:{discpId:id, discp:des}
    })
  }
  const setDesig = (id, des, grade) =>{
    dispatch({
      type: SET_DESIG,
      payLoad:{desigId:id, desigDes:des, desigGrade:grade}
    })
  }

  const setDelFlag = () => {
    dispatch({
      type: NEW_DEL,
      payLoad: { delFlag: (t) => !t },
    });
  };
  const setAddEditFlag = () => {
    dispatch({
      type: NEW_ADD_EDIT,
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
export default DesigState;
