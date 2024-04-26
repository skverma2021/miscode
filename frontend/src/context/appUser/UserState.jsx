import userContext from './UserContext';
import React, { useReducer } from 'react';
import axios from 'axios';
import userReducer from './UserReducer';
import { jwtDecode } from 'jwt-decode';
import { AUTH_USER, LOG_OUT } from '../types';

const UserState = (props) => {
  const initialState = {
    theUserId: '',
    theUser: '',
    theDeptt: '0',
    // theAuth: '',
  };

  const [state, dispatch] = useReducer(userReducer, initialState);

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
          // usrAuth: decoded.anAuth,
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
          // anAuth: 0,
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
        // userAuth: state.theAuth,
        authUser,
        logOutUser,
      }}
    >
      {props.children}
    </userContext.Provider>
  );
};
export default UserState;
