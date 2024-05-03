import { AUTH_USER, LOG_OUT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        theUser: action.payLoad.usrName,
        theDeptt: action.payLoad.usrDeptt,
        theUserId: action.payLoad.usrId,
      };
    case LOG_OUT:
      return {
        ...state,
        theUser: '',
        theDeptt: '',
        theUserId: '',
      };
    default:
      return state;
  }
};
