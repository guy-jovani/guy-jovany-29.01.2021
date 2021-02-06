

const handleErrors = require('../shared/utility').handleErrors;

const Message = require('../models/Message');
const users = require('../shared/utility').users; // list of users. the key is the email of the user

const sentTable = {}; // the key is the email of the user that sent the email
const receivedTable = {}; // the key is the email of the user that received the email




const addToTable = (req, table, key) => {
  if (table[key]) {
    table[key].push(
      new Message(
        req.user.email, 
        req.body.receiver, 
        req.body.message, 
        req.body.subject
      )
    );
  } else {
    table[key] = [new Message(
      req.user.email, 
      req.body.receiver, 
      req.body.message, 
      req.body.subject
      )];
  }
}

const removeFromTable = (table, key, creationDate) => {
  const messageInd = table[key].findIndex(message => {
    return new Date(message.creation).getTime() 
            === 
            new Date(creationDate).getTime()
  });
  table[key].splice(messageInd, 1);
}

exports.post = (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;
    if (!users[req.body.receiver]) {
      return res.status(400).json({
        type: 'failure',
        messages: ['Recipient does not exist.']
      });
    }

    addToTable(req, sentTable, req.user.email);
    addToTable(req, receivedTable, req.body.receiver);
    res.status(200).json({
      type: 'success'
    });
  } catch (err) {
    err.messages = ['Something went wrong, please try again later or notify the admins.'];
    next(err);
  }
};

exports.get = (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;

    res.status(200).json({
      type: 'success',
      sent: sentTable[req.user.email] || [],
      received: receivedTable[req.user.email] || [],
    });

  } catch (err) {
    err.messages = ['Something went wrong, please try again later or notify the admins.'];
    next(err);
  }
};

exports.delete = (req, res, next) => {
  try {
    if (!handleErrors(req, res)) return;

    if (req.body.type === 'sent') {
      removeFromTable(sentTable, req.user.email, req.body.creation);
    } else {
      removeFromTable(receivedTable, req.user.email, req.body.creation);
    }

    res.status(200).json({
      type: 'success',
      sent: sentTable[req.user.email] || [],
      received: receivedTable[req.user.email] || [],
    });

  } catch (err) {
    err.messages = ['Something went wrong, please try again later or notify the admins.'];
    next(err);
  }
};