const jwt = require('jsonwebtoken');

const authJwt = async (req, res, next) => {
  const { authorization } = req.headers;

  try {
    const secret = process.env.TOKEN_SECRET;
    const token = authorization.split(' ')[1];
    const decoded = await jwt.verify(token, secret);
    const { userID, userName } = decoded;
    req.userID = userID;
    req.userName = userName;
    next();
  } catch (err) {
    next('JwtVerify auth  failed !');
  }
};

module.exports = authJwt;
