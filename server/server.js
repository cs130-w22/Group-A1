const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
// const cookieParser = require('cookie-parser');
require('dotenv').config();

// env variable
const port = process.env.PORT || 5000;

// app setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// db connection
mongoose.Promise = Promise;
const mongooseClient = mongoose.connect(
  process.env.DB_URI,
  { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true },
)
  .then((c) => {
    console.log('Database connected succesfully');
    return c.connection.getClient();
  })
  .catch((err) => console.log(err));

// session initialization
app.use(session({
  secret: process.env.SECRET,
  name: 'sessionId',
  store: MongoStore.create({
    clientPromise: mongooseClient,
    dbName: 'db',
    stringify: true,
    touchAfter: 24 * 3600,
  }),
  saveUninitialized: false,
  cookie: {
    maxAge: 14 * 24 * 60 * 60,
  },
  resave: true,
}));

// routers
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const logoutRouter = require('./routes/logout');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const pollRouter = require('./routes/polls');
const eventRouter = require('./routes/event');

// routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);

// routes that require session auth
app.use(authRouter);
app.use('/users', userRouter);
app.use('/logout', logoutRouter);
app.use('/polls', pollRouter);
app.use('/event', eventRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
