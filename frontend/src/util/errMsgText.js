// At times Server may respond but the API may not respond
// When API responds
// all routes in their catch block use handleError(err, res) to respond

// *************************************

// const handleError = (err, res) => {
//   if (err.number) {
//     res.status(400).json({
//       msg: err.message.toLowerCase(),
//       eCode: err.number,
//     });
//   } else {
//     res.status(500).json({ msg: 'Internal Server Error', eCode: 500 });
//   }
// };
// module.exports = handleError;

// **************************************

// handleError(err, res) returns
// status 400 and object data: {msg:'error message from database', eCode: error number returned by Database}
// status 500 and object data: {msg:'Internal Server Error', eCode: 500}

export const errText = (err) => {
  // request  made ?
  if (!err.request) return `Request error`;

  //  server responded ?
  if (err.response) {
    console.log(err.response);
    // API responded ?
    if (typeof err.response.data.msg == 'undefined')
      // data object does not contain msg => API did not respond
      return `Server responded but API didn't`;
    // API responded => display the msg of data object
    return err.response.data.msg;
  }
  return `No Response Received`;
};

export const errNumber = (err) => {
  // did server respond
  if (err.response) {
    // Server's response received => look for API's response
    if (typeof err.response.data.msg !== 'undefined') {
      // API's response received => return eCode which contains error number
      return err.response.data.eCode;
    }
  }
  // Server did not respond => return 500
  return 500;
};
