const express = require('express');
const usersRouter = require('./users/userRouter');
const postsRouter = require('./posts/postRouter');

const server = express();
server.use(express.json());

// Custom middleware
server.use(logger);

server.use('/api/users', usersRouter);
server.use('/api/post', postRouter);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`)
});

//custom middleware

function logger(req, res, next) {
  console.log(`Request Type: ${req.method}`);
  console.log(`Request Url: ${req.url}`);
  console.log(`Request Url: ${req.url}`);
  console.log(new Date().getTime());
  next();
};

module.exports = server;
