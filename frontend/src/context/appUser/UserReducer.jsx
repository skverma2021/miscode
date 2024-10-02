import { AUTH_USER, LOG_OUT } from '../types';

export default (state, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        theUserId: action.payLoad.usrId,
        theUser: action.payLoad.usrName,
        theDepttId: action.payLoad.usrDepttId,
        theDeptt: action.payLoad.usrDeptt,
        theDesig: action.payLoad.usrDesig,
        theGrade: action.payLoad.usrGrade,
        theHrRate: action.payLoad.usrHrRate,
        tokenExpMsg: action.payLoad.usrExpMsg,
      };
    case LOG_OUT:
      return {
        ...state,
        theUserId: '',
        theUser: '',
        theDepttId: -1,
        theDeptt: '',
        theDesig: '',
        theGrade: '',
        theHrRate: '0',
        tokenExpMsg: 'Token Expired',
      };
    default:
      return state;
  }
};
