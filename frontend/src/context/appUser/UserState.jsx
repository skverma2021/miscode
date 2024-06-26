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
  };
  const [state, dispatch] = useReducer(UserReducer, initialState);

  const authUser = async (theEMailId, thePasswd) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/emps/${theEMailId}/${thePasswd}`
      );
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      const decoded = jwtDecode(res.data.token);
      dispatch({
        type: AUTH_USER,
        payLoad: {
          usrId: decoded.eID,
          usrName: decoded.eName,
          usrDeptt: decoded.eDepttID,
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
        authUser,
        logOutUser,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};