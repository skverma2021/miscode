const jwt = require('jsonwebtoken');
const configJwt = require('config');

const auth =  (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) {
    // Handle the case where no token is provided
    return res.status(400).json({ msg: 'No token provided' });
  }
  
  const tokenValue = token.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(tokenValue, configJwt.get('jwtPrivateKey'));

    // if you want to allow some leeway in the expiration time (10 sec)
    // const decoded = jwt.verify(tokenValue, configJwt.get('jwtPrivateKey'), {clockTolerance: 10 });

    req.user = decoded;

    // to find elapsed time
    // const eTime = Math.floor(
    //   (Math.floor(Date.now()) - parseInt(decoded.iat) * 1000) / 1000);
    // req.elapsedTime = eTime;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      console.log('Token has expired');
      return res.status(400).json({ msg: 'Expired Token' });
    } else {
      console.log('Other error:', err);
      return res.status(500).json({ msg: 'Internal Server Error' });
    }
  }
};

module.exports = auth;
