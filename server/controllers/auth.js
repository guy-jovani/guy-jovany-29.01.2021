


const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const handleErrors = require('../shared/utility').handleErrors;


const users = require('../shared/utility').users; // the key is the email of the user

let id = 0; // will fulfill the rule of a DB id


/**
 * Creates a Jason Web Token, that expires in process.env.JWT_TOKEN_EXPIRATION_SECONDS
 * with information about the user id, email.
 * @param {string} email - The user email
 * @param {string || number} id - The user id
 * @return {string} - the accessToken.
 */
getAndCreateToken = (email, id) => {
  const accessToken = jwt.sign({
    userId: id,
    email
  }, process.env.SECRET_TOKEN_KEY, { expiresIn: process.env.JWT_TOKEN_EXPIRATION_SECONDS +'s' });
  return accessToken;
};

/**
 * Creates a Refresh Jason Web Token - with no expiration.
 * With information about the user id, email.
 * 
 * @param {string} email - The user email
 * @param {string || number} id - The user id
 * @return {string} - the refreshToken.
 */
getAndCreateRefreshToken = (email, id) => {
  const refreshToken = jwt.sign({
    userId: id,
    email: email
  }, process.env.SECRET_TOKEN_KEY );
  return refreshToken;
};


/**
 * Signing a user up and upon success sending a respond to the client with the following:
 *    {string} type - 'success' - meaning the signup succeeded
 *    {string} accessToken - a JWT related to the user
 *    {string} expiresInSeconds - the number of seconds until the token expires
 *    {object} user - the user object of who that signed up
 * 
 * @param {express request object} req - the req need to have a body with: 
 *                                {string} email - the email of the new user
 *                                {string} password - the password of the new user
 *                                {string} confirmPassword - the confirmPassword of the new user
 * @param {express respond object} res
 */
exports.signup = async (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;
    const email = req.body.email.toLowerCase();

    if (users[email]) {
      return res.status(400).json({
        type: 'failure',
        messages: ['Email already exists.']
      });
    }

    id++;
    const password = await bcrypt.hash(req.body.password, 12);
    const token = await getAndCreateToken(email, id);
    const rToken = await getAndCreateRefreshToken(email, id);
    
    users[email] = { email, id, password, rToken };
    
    res.status(201).json({
      type: 'success',
      token,
      rToken,
      user: {email, id},
      expiresInSeconds: process.env.JWT_TOKEN_EXPIRATION_SECONDS
    });
  } catch (err) {
    err.messages = ["There was an unexpected error while trying to signup."];
    next(err);
  }
};


/**
 * login a user in and upon success sending a respond to the client with the following:
 *    {string} type - 'success' - meaning the signup succeeded
 *    {string} accessToken - a JWT related to the user
 *    {string} expiresInSeconds - the number of seconds until the token expires
 *    {string} refreshToken - a JWT related to the user to refresh the accessToken
 *    {object} user - the user object of who that signed up
 *  
 * @param {express request object} req - the req need to have a body with: 
 *                                        {string} email - the email of the new user
 *                                        {string} password - the password of the new user
 * @param {express respond object} res
 */
exports.login = async (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;
    const email = req.body.email.toLowerCase();

    let verifiedPassword = users[email] ? await bcrypt.compare(req.body.password, users[email].password) : null;

    if (!users[email] || !verifiedPassword) {
      return res.status(400).json({
        type: 'failure',
        messages: ['The email and/or password are incorrect.']
      });
    }
    const user = { email, id: users[email].id };

    const token = await getAndCreateToken(email, user.id);
    const rToken = await getAndCreateRefreshToken(email, user.id);

    res.status(200).json({
      type: 'success',
      token,
      expiresInSeconds: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
      rToken,
      user
    });
  } catch (err) {
    err.messages = ["There was an unexpected error while trying to login."];
    next(err);
  }
};


/**
 * Deleting the refresh token from the user db
 * and upon success sending a respond to the client with the following:
 *    {string} type - 'success' - meaning the password had a reset.
 * 
 * @param {express request object} req
 * @param {express respond object} res
 */
exports.logout = async (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;
    users[req.body.email].rToken = null;

    res.status(200).json({
      type: 'success'
    });

  } catch (err) {
    err.messages = ["Something went wrong while trying to logout."];
    next(err);
  }
}

/**
 * Creating a new JWT access token for the user
 * and upon success sending a respond to the client with the following:
 *    {string} type - 'success' - meaning the password had a reset.
 *    {string} newToken - the new token
 *    {string} expiresInSeconds - the number of seconds till the token will get expired
 * 
 * @param {express request object} req - the req need to have a body with: 
 *                                        {string} refreshToken - the user refresh token
 * @param {express respond object} res
 */
exports.refreshToken = async (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;
    const rToken = req.query.rToken;
    const payload = jwt.verify(rToken, process.env.SECRET_TOKEN_KEY);
    const newToken = getAndCreateToken(payload.email, payload.userId);
    if (!users[payload.email].rToken && users[payload.email].rToken !== rToken) {
      throw 'error';
    }

    res.status(200).json({
      type: 'success',
      newToken,
      expiresInSeconds: process.env.JWT_TOKEN_EXPIRATION_SECONDS,
    });
  } catch (err) {
    err.messages = ["Auth Fail. You need to login."];
    next(err);
  }
}
