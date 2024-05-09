import {
  EDIT_POSTING,
  EDIT_TRANSFER,
  EDIT_RESET,
  NEW_REC_DESIG,
  UPD_REC_DESIG,
  NEW_REC_DEPTT,
  UPD_REC_DEPTT,
  // REPORT_ERROR,
} from '../types';

export default (state, action) => {

  return { ...state, ...action.payLoad };
};
