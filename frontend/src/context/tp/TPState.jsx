// import TPContext from './TPContext';
// import React, { useReducer } from 'react';

// const TPReducer = (state, action) => {
//   return { ...state, ...action.payLoad };
// };

// const TPState = (props) => {
//   const initialState = {
//     postId: '', // empDesigId
//     postDesigId: '', // desigId
//     postFromDt: '', // fromDt

//     trId: '', // empDepttId
//     trDepttId: '', // depttId
//     trFromDt: '', // fromDt

//     desigFlag: false,
//     depttFlag: false,
//   };

//   const [state, dispatch] = useReducer(TPReducer, initialState);

//   const setDg = (edgid, dgid, edgfd) => {
//     dispatch({
//       payLoad: { postId: edgid, postDesigId: dgid, postFromDt: edgfd },
//     });
//   };
//   const setDp = (edpid, dpid, edpfd) => {
//     dispatch({
//       payLoad: { trId: edpid, trDepttId: dpid, trFromDt: edpfd },
//     });
//   };

//   const toggleDesigFlag = () => {
//     dispatch({
//       payLoad: { desigFlag: (t) => !t },
//     });
//   };

//   const toggleDepttFlag = () => {
//     dispatch({
//       payLoad: { depttFlag: (t) => !t },
//     });
//   };

//   return (
//     <TPContext.Provider
//       value={{
//         tpState: state,
//         setDg,
//         setDp,

//         toggleDesigFlag,
//         toggleDepttFlag,
//       }}
//     >
//       {props.children}
//     </TPContext.Provider>
//   );
// };
// export default TPState;
