if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const api = require('./api');
const sequelize = require('./config/connection');
const { insertSongs } = require('./database');
const routes = require('./controller');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

const users = []; 

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.use(routes);

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

  sequelize.sync({ force: true })
    .then(() => {
      api.searchSongsByGenre(genre, popularity, numSongs)
        .then(function (tracks) {
          console.log("Tracks:", tracks);

          insertSongs(tracks.tracks)
            .then(() => {
              res.json({ tracks });
            })
            .catch(function (err) {
              console.log('Error inserting songs:', err);
              res.status(500).json({ error: 'Error inserting songs into the database' });
            });
        })
        .catch(function (err) {
          console.log('Something went wrong!', err);
          res.status(500).json({ error: 'Error generating playlist' });
        });
    })
    .catch((error) => {
      console.log('Error syncing models:', error);
      res.status(500).json({ error: 'Error syncing models' });
    });
});

const PORT = process.env.PORT || 3008;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
