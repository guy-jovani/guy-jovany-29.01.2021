



const express = require('express')
const router = express.Router();
const { body, query } = require('express-validator');





const controller = require('../controllers/email');

router.post('/post', [
  body('receiver').custom((value, { req }) => {
    const emailPat = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    if (!value || !emailPat.test(value)) {
      throw new Error('Please provide a valid recipient email address.');
    }
    return true;
  }),
  body('subject')
    .exists()
    .isLength(3)
    .withMessage('The Subject should be at least 3 characters long.'),
  body('message')
    .exists()
    .notEmpty()
    .withMessage('The Message field is required.'),
], controller.post);

router.get('/get', controller.get);

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









