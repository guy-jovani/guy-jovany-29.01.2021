
const jwt = require('jsonwebtoken');

 
/**
 * Check for a valid JWT.
 * 
 * @param {express request object} req - the req headers need to have an authorization
 *                                 property with the token in the template of "Bearer <%TOKEN_VALUE%>"
 * @param {express respond object} res
 */
module.exports = (req, res, next) => {
  try {
    if(req.method === "OPTIONS") return next();
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.SECRET_TOKEN_KEY);
    req.user = {
      id: decodeToken.userId,
      email: decodeToken.email
    }
    next();
  } catch (error) {
    if ( error.name === 'TokenExpiredError' ) {
      res.status(401).json({
        messages: ['The JWT is Expired.'],
        type: 'TokenExpiredError'
      });
    } else {
      error.messages = ["Authorization Fail. You need to login."];
      next(error);
    }
  }
};