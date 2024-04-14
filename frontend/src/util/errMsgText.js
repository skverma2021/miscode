export const errText = (err) => {
  if (err.response) {
    if (typeof err.response.data.msg == 'undefined') {
      return `API did not respond although server did`;
    } else {
      return err.response.data.msg;
    }
  } else if (err.request) {
    return `No response received`;
  } else {
    return `Request error`;
  }
};

export const errNumber = (err) => {
  if (err.response) {
    if (typeof err.response.data.msg !== 'undefined') {
      return err.response.data.eCode;
    }
  }
  return 500;
};
