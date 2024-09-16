import UserContext from './UserContext';
import React, { useReducer } from 'react';
import axios from 'axios';
import UserReducer from './UserReducer';
import { jwtDecode } from 'jwt-decode';
import { AUTH_USER, LOG_OUT } from '../types';

export default (props) => {
  const initialState = {
    theUserId: '',
    theUser: '',
    theDeptt: '0',
    theGrade: '',
    theHrRate: '0',
    expMsg: '',
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const authUser = async (theEMailId, thePasswd) => {
    try {
      const res = await axios.post(`http://localhost:3000/api/emps/login`, {
        theEMailId,
        thePasswd,
      });
      axios.defaults.headers.common[
        'Authorization'
      ] = `Bearer ${res.data.token}`;
      const decoded = jwtDecode(res.data.token);
      const expDate = new Date(decoded.exp * 1000);
      console.log(
        'Token will expire at Hrs:',
        expDate.getHours(),
        ' Min:',
        expDate.getMinutes(),
        ' Sec:',
        expDate.getSeconds()
      );
      dispatch({
        type: AUTH_USER,
        payLoad: {
          usrId: decoded.eID,
          usrName: decoded.eName,
          usrDeptt: decoded.eDepttID,
          usrGrade: decoded.eGrade,
          usrHrRate: decoded.eHrRate,
          usrExpMsg: `Token Expires at ${expDate.getHours()}:${expDate.getMinutes()}:${expDate.getSeconds()}`,
        },
      });
    } catch (error) {
      console.log(error);
      delete axios.defaults.headers.common['Authorization'];
      dispatch({
        type: AUTH_USER,
        payLoad: {
          usrId: '',
          usrName: '',
          usrDeptt: -1,
          usrGrade: '',
          usrHrRate: 0,
        },
      });
    }
  };
  const logOutUser = () => {
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: LOG_OUT, payLoad: {} });
  };

  return (
    <UserContext.Provider
      value={{
        user: state.theUser,
        deptt: state.theDeptt,
        userId: state.theUserId,
        grade: state.theGrade,
        hrRate: state.theHrRate,
        expMsg: state.expMsg,
        authUser,
        logOutUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};
