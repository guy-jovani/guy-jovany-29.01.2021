


const express = require('express');
const bodyParser = require('body-parser');
const emailRoutes = require('./routes/email');
const authRoutes = require('./routes/auth');
const checkAuth = require('./middleware/checkAuth');

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization');
  next();
});

app.use('/email', checkAuth, emailRoutes);
app.use('/auth', authRoutes);

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


