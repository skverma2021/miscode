import { createContext, useReducer } from 'react';
export const TPContext = createContext();

// const TPReducer = (state, action) => {
//   return { ...state, ...action.payLoad };
// };

const TPReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DESIGNATION':
      return { ...state, postId: action.payLoad.postId, postDesigId: action.payLoad.postDesigId, postFromDt: action.payLoad.postFromDt };
    case 'SET_DEPARTMENT':
      return { ...state, trId: action.payLoad.trId, trDepttId: action.payLoad.trDepttId, trFromDt: action.payLoad.trFromDt };
    case 'SET_EMP':
      return { ...state, empId: action.payLoad.empId };

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

    postId: '', // empDesigId
    postDesigId: '', // desigId
    postFromDt: '', // fromDt

    trId: '', // empDepttId
    trDepttId: '', // depttId
    trFromDt: '', // fromDt

    desigFlag: false,
    depttFlag: false,
  };

  const [state, dispatch] = useReducer(TPReducer, initialState);


  const setDesig = (edgid, dgid, edgfd) => {
    dispatch({ type: 'SET_DESIGNATION',payLoad: { postId: edgid, postDesigId: dgid, postFromDt: edgfd },
    });
  };


  const setDeptt = (edtid, dtid, edtfd) => {
    dispatch({ type: 'SET_DEPARTMENT', payLoad: { trId: edtid, trDepttId: dtid, trFromDt: edtfd },
    });
  };

  const setEmp = (theTxt) => {
      dispatch({ type: 'SET_EMP', payLoad: {empId: theTxt },
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
