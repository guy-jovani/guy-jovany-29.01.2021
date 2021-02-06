

const express = require('express')
const router = express.Router();

const { body, query } = require('express-validator');

const authController = require('../controllers/auth');

router.post('/signup', 
  [
    body('email').custom((value, { req }) => {
      const emailPat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (!value || !emailPat.test(value)) {
        throw new Error('Please provide a valid email address.');
      }
      return true;
    }),
    body('password')
      .isLength(3)
      .withMessage('The password need to be more than 3 characters long.'),
    body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password.');
      }
      return true;
    })
  ], 
  authController.signup);

router.post('/login', [
  body('email').custom((value, { req }) => {
    const emailPat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!value || !emailPat.test(value)) {
      throw new Error('Please provide a valid email address.');
    }
    return true;
  }),
  body('password')
    .isLength(3)
    .withMessage('The password need to be more than 3 characters long.')
], authController.login);


router.get('/rToken', 
  [
    query('rToken')
      .exists()
      .notEmpty()
      .withMessage('No Refresh Token was provided.'),
  ], 
  authController.refreshToken);

router.post('/logout', [
  body('email').custom((value, { req }) => {
    const emailPat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!value || !emailPat.test(value)) {
      throw new Error('Please provide a valid email address.');
    }
    return true;
  }),
], authController.logout);

module.exports = router;