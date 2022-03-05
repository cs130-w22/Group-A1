const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const createServer = require('./app');
// const cookieParser = require('cookie-parser');
require('dotenv').config();

// env variable
const port = process.env.PORT || 5000;

// db connection
mongoose.Promise = Promise;
const mongooseClient = mongoose
  .connect(process.env.DB_URI, {
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((c) => {
    console.log('Database connected succesfully');
    return c.connection.getClient();
  })
  .catch((err) => console.log(err));

// session initialization
const sessionMiddleware = session({
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
});

createServer([sessionMiddleware]).listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
