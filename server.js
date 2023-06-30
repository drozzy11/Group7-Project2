

const express = require('express');
const app = express();
const api = require('./api');

const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');

const initializePassport = require('./passport-config');
initializePassport(
  passport, 
  email => {  users.find(user => user.email === email),
  id => {  users.find(user => user.id === id) }
  });

const users = [];

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', checkAuthenticated,  (req, res) => {
  res.render('index.ejs', { name: req.user.name });
});

app.get('/login', (req, res) => {
  res.render('login.ejs');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}));

app.get('/register', (req, res) => {
  res.render('register.ejs');
});

app.post('/register', async (req, res) => {
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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
      return next();
  }
  res.redirect('/login');
}

// Serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/playlist.html');
});


app.use(express.json());

app.get('/callback', (req, res) => {
  const { genre, popularity, numSongs } = req.query;

  if (!genre || !popularity || !numSongs) {
    res.status(400).json({ error: 'Genre, popularity, and numSongs are required' });
    return;
  }

  api.searchSongsByGenre(genre, popularity, numSongs)
    .then(function (tracks) {
      console.log("Tracks:", tracks); // Add this line for debugging
      res.json({ tracks });
    })
    .catch(function (err) {
      console.log('Something went wrong!', err);
      res.status(500).json({ error: 'Error generating playlist' });
    });
});

app.listen(3008, () => {
  console.log('Server listening on port 3008');
});
