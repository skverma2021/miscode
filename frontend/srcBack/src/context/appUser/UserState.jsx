import userContext from './UserContext';
import React, { useReducer } from 'react';
import axios from 'axios';
import userReducer from './UserReducer';
import { jwtDecode } from 'jwt-decode';
import { AUTH_USER, SET_MENU, LOG_OUT } from '../types';

const UserState = (props) => {
  const initialState = {
    theUserId: '',
    theUser: '',
    theDeptt: '',
    theAuth: '',
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

  const authUser = async (theEMailId, thePasswd) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/emps/${theEMailId}/${thePasswd}`
      );
      // In JavaScript, undefined is a falsy value => !undefined is true
      if (!res.data.token) {
        delete axios.defaults.headers.common['Authorization'];
        dispatch({
          type: AUTH_USER,
          payLoad: {
            usrId: '',
            usrName: '',
            usrDeptt: '',
            usrAuth: '',
          },
        });
      } else {
        axios.defaults.headers.common[
          'Authorization'
        ] = `Bearer ${res.data.token}`;
        const decoded = jwtDecode(res.data.token);
        dispatch({
          type: AUTH_USER,
          payLoad: {
            usrId: decoded.eID,
            usrName: decoded.eName,
            usrDeptt: decoded.eDepttID,
            usrAuth: decoded.anAuth,
          },
        });
      }
    } catch (error) {
      console.log(error);
      dispatch({
        type: AUTH_USER,
        payLoad: {
          usrId: '',
          usrName: '',
          usrDeptt: -1,
          anAuth: 0,
        },
      });
    }
  };
  const logOutUser = () => {
    delete axios.defaults.headers.common['Authorization'];
    dispatch({ type: LOG_OUT, payLoad: {} });
  };

  return (
    <userContext.Provider
      value={{
        user: state.theUser,
        deptt: state.theDeptt,
        userId: state.theUserId,
        userAuth: state.theAuth,
        authUser,
        logOutUser,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};
export default UserState;
