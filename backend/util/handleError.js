const handleError = (err, res) => {
  if (err.number) {
    res.status(400).json({
      msg: err.message.toLowerCase(),
      eCode: err.number,
    });
    // console.log(err.number);
  } else {
    res.status(500).json({ msg: 'Internal Server Error', eCode: 500 });
  }
};

module.exports = handleError;
