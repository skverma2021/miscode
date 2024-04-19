export const errText = (err) => {
  if (!err.request) return `Request error`;
  if (err.response) {
    console.log(err.response);
    if (typeof err.response.data.msg == 'undefined')
      return `Server responded but API didn't`;
    return err.response.data.msg;
  }
  return `No Response Received`;
};

export const errNumber = (err) => {
  if (err.response) {
    if (typeof err.response.data.msg !== 'undefined') {
      return err.response.data.eCode;
    }
  }
  return 500;
};
