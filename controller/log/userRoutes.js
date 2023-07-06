const router = require('express').Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

const users = [];

const initializePassport = require('../../passport-config');
initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id =>  users.find(user => user.id === id) 
  );


router.get('/',  (req, res) => {
  res.render('index.ejs');
});

router.get('/login', checkNotAuthenticated, (req, res) => {
  res.render('login.ejs');
});

router.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/playlist.html',
  failureRedirect: '/login',
  failureFlash: true
}));

router.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register.ejs');
});

router.post('/register', checkNotAuthenticated, async (req, res) => {
  try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      users.push({
          id: Date.now().toString(),
          name: req.body.name,
          email: req.body.email,
          password: hashedPassword
      });
      res.redirect('/login');
  }
  catch {
      res.redirect('/register');
  }
  console.log(users);
});

router.delete('/logout', (req, res) => {
  req.logOut();
  res.redirect('/index.html');
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return res.redirect('/');
  }
  next();
}

module.exports = router;