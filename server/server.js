const express = require("express");
const cors = require("cors");

const mongoose = require("mongoose");
require('dotenv').config();

// env variables
const port = process.env.PORT || 5000;

// app setup
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// db connection
mongoose.Promise = Promise;
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true , useUnifiedTopology: true})
    .then(() => console.log('Database connected succesfully'))
    .catch((err) => console.log(err));

// routers
const loginRouter = require('./routes/login');
const signupRouter = require('./routes/signup');
const router = require('./routes/api');
const poll = require ('./routes/poll')

// routes
app.use('/login', loginRouter);
app.use('/signup', signupRouter);
// todo authenticate
app.use('/api', router);
app.use('/poll', poll)


app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});