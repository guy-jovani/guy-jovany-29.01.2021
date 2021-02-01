

const { validationResult } = require('express-validator');
const Message = require('../models/Message');
const sentTable = {};
const receivedTable = {};


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

const handleErrors = (req, res) => {
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

const addToTable = (req, table, key) => {
  if (table[key]) {
    table[key].push(
      new Message(
        req.body.sender, 
        req.body.receiver, 
        req.body.message, 
        req.body.subject
      )
    );
  } else {
    table[key] = [new Message(
      req.body.sender, 
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
    addToTable(req, sentTable, req.body.sender);
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
      sent: sentTable[req.query.id] || [],
      received: receivedTable[req.query.id] || [],
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
      removeFromTable(sentTable, req.body.sender, req.body.creation);
    } else {
      removeFromTable(receivedTable, req.body.receiver, req.body.creation);
    }

    res.status(200).json({
      type: 'success',
      sent: sentTable[req.body.sender],
      received: receivedTable[req.body.receiver],
    });

  } catch (err) {
    err.messages = ['Something went wrong, please try again later or notify the admins.'];
    next(err);
  }
};