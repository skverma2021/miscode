import React, { useReducer, createContext } from 'react';

export const DesigContext = createContext();

// The reducer function
const DesigReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DISCP':
      return { ...state, discpId: action.payload.discpId, discp: action.payload.discp };
    case 'SET_DESIG':
      return { ...state, desigId: action.payload.desigId, desigDes: action.payload.desigDes, desigGrade: action.payload.desigGrade };
    case 'SET_DESIG_FLAG':
      return { ...state, desigFlag: !state.desigFlag };
    default:
      return state;
  }
};

export const DesigState = (props) => {
  const initialState = {
    discpId: 0,
    discp: '',
    desigId: 0,
    desigDes: '',
    desigGrade: '',
    desigFlag: false,
  };

  const [state, dispatch] = useReducer(DesigReducer, initialState);

  const setDiscp = (id, des) => {
    dispatch({ type: 'SET_DISCP', payload: { discpId: id, discp: des } });
  };
  const setDesig = (id, des, grade) => {
    dispatch({ type: 'SET_DESIG', payload: { desigId: id, desigDes: des, desigGrade: grade } });
  };

  const setDesigFlag = () => {
    dispatch({ type: 'SET_DESIG_FLAG' });
  };

  return (
    <DesigContext.Provider
      value={{
        ...state,
        setDiscp,
        setDesig,
        setDesigFlag,
      }}
    >
      {props.children}
    </DesigContext.Provider>
  );
};