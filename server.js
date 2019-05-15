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
  console.log(`Type: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log(new Date(Date.parse(Date())));
  next();
};

module.exports = server;
