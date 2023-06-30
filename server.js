// server.js

const express = require('express');
const app = express();
const api = require('./api');
const sequelize = require('./config/connection');
const { insertSongs } = require('./database');

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

app.listen(3008, () => {
  console.log('Server listening on port 3008');
});
