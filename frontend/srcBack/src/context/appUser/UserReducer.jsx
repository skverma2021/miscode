import { AUTH_USER, LOG_OUT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        theUser: action.payLoad.usrName,
        theDeptt: action.payLoad.usrDeptt,
        theUserId: action.payLoad.usrId,
        theAuth: action.payLoad.usrAuth,
      };
    case LOG_OUT:
      return {
        ...state,
        theUser: '',
        theDeptt: '',
        theUserId: '',
        theAuth: '',
      };
    default:
      return state;
  }
};
