const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const config = require('./config/keys');

const { User } = require('./models/user');
const { auth } = require('./middleware/auth');

mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
  .then(() => {
    console.log('MongoDB database connection established successfully');
  })
  .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ hello: 'hello' });
});

// ROUTES

// Authenticate user
app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastame: req.user.lastname,
    role: req.user.role
  });
});

// Register user
app.post('/api/user/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, doc) => {
    if (err) return res.json({ succes: false, err });
    res.status(200).json({
      succes: true,
      userData: doc
    });
  });
});

//Login
app.post('/api/user/login', (req, res) => {
  // find the email
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found'
      });
    // compare password in database
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'wrong password' });
    });
    // generate token
    user.generateToken((err, user) => {
      if (err) return res.status(400).send(err);
      res.cookie('x_auth', user.token).status(200).json({
        loginSuccess: true
      });
    });
  });
});

// To log out user
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true
    });
  });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
