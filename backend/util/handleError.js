// returns
// with status 400 - {msg:'error message from database', eCode: error number returned by Database}
// with status 500 - {msg:'Internal Server Error', eCode: 500}

const handleError = (err, res) => {
  if (err.number) {
    res.status(400).json({
      msg: err.message.toLowerCase(),
      eCode: err.number,
    });
  } else {
    res.status(500).json({ msg: 'Internal Server Error', eCode: 500 });
  }
};

module.exports = handleError;
