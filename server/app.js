


const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/routes');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
  next();
});

app.use('/manage', routes);

app.use((req, res, next) => {
  res.status(200).json({
    messages: ['Invalid url.'],
    type: 'failure',
  });
});

app.use((error, req, res, next) => {
  if (typeof(error) !== 'object') {
    error = {messages: [error]};
  }
  res.status(error.statusCode || 500).json({ 
    messages: error.messages,
    type: 'failure',
  });
});


const server = app.listen(process.env.PORT || 5000); 


