



const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator');





const controller = require('../controllers/controllers');

router.post('/post', [
  body('sender')
    .exists()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage('The Sender Id should be a positive number.'),
  body('receiver')
    .exists()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage('The Receiver Id should be a positive number.'),
  body('subject')
    .exists()
    .isLength(3)
    .withMessage('The Subject should be at least 3 characters long.'),
  body('message')
    .exists()
    .notEmpty()
    .withMessage('The Message field is required.'),
], controller.post);

router.get('/get', [
  query('id')
    .exists()
    .not()
    .isEmpty()
    .isInt({ gt: 0 })
    .withMessage('The Id should be a positive number.'),
], controller.get);

router.delete('/delete', [
  body('type').custom((value, { req }) => {
    if (!value || value.trim() === '') {
      throw new Error('"type" field is a required field.');
    }
    
    if (value.trim() !== 'sent' && value.trim() !== 'received') {
      throw new Error('type" field value must be "sent" or "received".');
    }
    return true;
  }),
  body('sender')
    .exists()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage('The Sender Id should be a positive number.'),
  body('receiver')
    .exists()
    .notEmpty()
    .isInt({ gt: 0 })
    .withMessage('The Receiver Id should be a positive number.'),
  body('creation').custom((value, { req }) => {
    if (!value || value.trim() === '') {
      throw new Error('"Creation" field is a required field.');
    }
    
    if (new Date(value) > new Date()) {
      throw new Error('Creation" field can\'t be in the future.');
    }
    return true;
  }),
], controller.delete);




module.exports = router;









