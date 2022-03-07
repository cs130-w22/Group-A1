const express = require('express');
const cors = require('cors');
const path = require('path');

// routers
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const pollRouter = require('./routes/polls');
const eventRouter = require('./routes/event');
const inviteRouter = require('./routes/invite');

// app setup

const createServer = (middleware) => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  // app.use(express.static(path.join(__dirname, 'client', 'build', 'static')));
  
  // app.get('/', function (req, res) {
  //   res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
  // });

  // other middleware
  if (middleware != null && Array.isArray(middleware)) {
    middleware.forEach((m) => app.use(m));
  }

  // routes
  app.use('/login', loginRouter);
  app.use('/signup', signupRouter);

  // routes that require session auth
  app.use(authRouter);
  app.use('/users', userRouter);
  app.use('/logout', logoutRouter);
  app.use('/polls', pollRouter);
  app.use('/event', eventRouter);
  app.use('/invite', inviteRouter);
  return app;
};

module.exports = createServer;
