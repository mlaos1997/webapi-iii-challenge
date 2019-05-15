const express = require('express');
const usersRouter = require('./users/userRouter');

const server = express();

server.use(express.json());

// Custom middleware
server.use(logger);

server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request Url: ${req.url}`);
  console.log(`Request Url: ${req.url}`);
  console.log(Date.now());
  next();
};

module.exports = server;
