import { createContext, useReducer } from 'react';
export const TPContext = createContext();

const TPReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DESIGNATION':
      return { ...state, promotionId: action.payload.promotionId, promotionDesigId: action.payload.promotionDesigId, promotionDt: action.payload.promotionDt };
    case 'SET_DEPARTMENT':
      return { ...state, transferId: action.payload.transferId, transferDepttId: action.payload.transferDepttId, transferDt: action.payload.transferDt };
    case 'SET_EMP':
      return { ...state, empId: action.payload.empId };

    case 'SET_DESIG_FLAG':
      return { ...state, desigFlag: !state.desigFlag };
    case 'SET_DEPTT_FLAG':
      return { ...state, depttFlag: !state.depttFlag };

    default:
      return state;
  }
};

export const TPState = (props) => {
  const initialState = {
    empId: '',

    promotionId: '', // empDesigId
    promotionDesigId: '', // desigId
    promotionDt: '', // fromDt

    transferId: '', // empDepttId
    transferDepttId: '', // depttId
    transferDt: '', // fromDt

    desigFlag: false,
    depttFlag: false,
  };

  const [state, dispatch] = useReducer(TPReducer, initialState);

  const setDesig = (edgid, dgid, edgfd) => {
    dispatch({ type: 'SET_DESIGNATION',payload: { promotionId: edgid, promotionDesigId: dgid, promotionDt: edgfd },
    });
  };

  const setDeptt = (edtid, dtid, edtfd) => {
    dispatch({ type: 'SET_DEPARTMENT', payload: { transferId: edtid, transferDepttId: dtid, transferDt: edtfd },
    });
  };

  const setEmp = (theTxt) => {
      dispatch({ type: 'SET_EMP', payload: {empId: theTxt },
      });
    };

  const toggleDesigFlag = () => {
    dispatch({ type: 'SET_DESIG_FLAG'
    });
  };

  const toggleDepttFlag = () => {
    dispatch({ type: 'SET_DEPTT_FLAG'
    });
  };

  return (
    <TPContext.Provider
      value={{
        tpState: state,
        
        setDesig,
        setDeptt,

        toggleDesigFlag,
        toggleDepttFlag,

        setEmp,
      }}
    >
      {props.children}
    </TPContext.Provider>
  );
};
