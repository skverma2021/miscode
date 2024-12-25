import { createContext, useReducer } from 'react';
export const TPContext = createContext();

const TPReducer = (state, action) => {
  switch (action.type) {
    case 'SET_POSTING':
      return { ...state, postingId: action.payload.postingId, postingDesigId: action.payload.postingDesigId, postingDt: action.payload.postingDt };
    case 'SET_TRANSFER':
      return { ...state, transferId: action.payload.transferId, transferDepttId: action.payload.transferDepttId, transferDt: action.payload.transferDt };
    case 'SET_EMP':
      return { ...state, empId: action.payload.empId };

    case 'SET_POSTING_FLAG':
      return { ...state, postingFlag: !state.postingFlag };
    case 'SET_TRANSFER_FLAG':
      return { ...state, transferFlag: !state.transferFlag };

    default:
      return state;
  }
};

export const TPState = (props) => {
  const initialState = {
    empId: '',

    postingId: '', // empDesigId
    postingDesigId: '', // desigId
    postingDt: '', // fromDt

    transferId: '', // empDepttId
    transferDepttId: '', // depttId
    transferDt: '', // fromDt

    postingFlag: false,
    transferFlag: false,
  };

  const [state, dispatch] = useReducer(TPReducer, initialState);

  const setPosting = (thePostingId, thePostingDesigId, thePostingDt) => {
    dispatch({ type: 'SET_POSTING',payload: { postingId: thePostingId, postingDesigId: thePostingDesigId, postingDt: thePostingDt },
    });
  };

  const setTransfer = (theTransferId, theTransferDepttId, theTransferDt) => {
    dispatch({ type: 'SET_TRANSFER', payload: { transferId: theTransferId, transferDepttId: theTransferDepttId, transferDt: theTransferDt },
    });
  };

  const setEmp = (theTxt) => {
      dispatch({ type: 'SET_EMP', payload: {empId: theTxt },
      });
    };

  const togglePostingFlag = () => {
    dispatch({ type: 'SET_POSTING_FLAG'
    });
  };

  const toggleTransferFlag = () => {
    dispatch({ type: 'SET_TRANSFER_FLAG'
    });
  };

  return (
    <TPContext.Provider
      value={{
        tpState: state,
        
        setPosting,
        setTransfer,

        togglePostingFlag,
        toggleTransferFlag,

        setEmp,
      }}
    >
      {props.children}
    </TPContext.Provider>
  );
};
