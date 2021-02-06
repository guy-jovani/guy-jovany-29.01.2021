
const { validationResult } = require('express-validator');

exports.users = {}; // the key is the email of the user
/**
 * Validate the parameters of the request to check they are legit
 * 
 * 
 * @param {express request object} req - with the params (body/query) to validate
 * @return object with the type of validation (success/failure),
 *          in case of a failure the object will hold an array of messages
 *          inline with the errors of the params
 */
const handleValidationRoutesErrors = req => {
  const reqErrors = validationResult(req);
  if(!reqErrors.isEmpty()){
    let messages = reqErrors.errors.reduce((prev, curr) => {
      if(!prev.includes(curr['msg'])) {
        prev.push(curr['msg']);
      }
      return prev;
    }, []);
    return {
      type: 'failure',
      messages
    }
  }
  return {
    type: 'success'
  }
};

/**
 * Validate the parameters of the request to check they are legit
 * and send a response to the client in case of invalidation
 * 
 * 
 * @param {express request object} req - with the params (body/query) to validate
 * @return true if valid, false otherwise
 */
exports.handleErrors = (req, res) => {
  const routeErrors = handleValidationRoutesErrors(req);
  if(routeErrors.type === 'failure') {
    res.status(400).json({
      type: 'failure',
      messages: routeErrors.messages
    });
    return false;
  }
  return true;
}