
const express = require('express');
const app = express();

// static files from the "public" directory
app.use(express.static('public'));

app.use(express.json());

app.get('/callback', (req, res) => {
  const { genre, popularity, numSongs } = req.query;

  if (!genre || !popularity || !numSongs) {
    res.status(400).json({ error: 'Genre, popularity, and numSongs are required' });
    return;
  }

  const api = require('./api');

  api.searchSongsByGenre(genre, popularity, numSongs)
    .then(function (tracks) {
      console.log("Tracks:");
      for (let track of tracks) {
        console.log(track.name + " : " + track.artists[0].name);
      }

      // Send the tracks array to the webpage
      res.send(tracks);
    })
    .catch(function (err) {
      console.log('Something went wrong!', err);
      res.status(500).json({ error: 'Error generating playlist' });
    });
});

app.listen(3008, () => {
  console.log('Server listening on port 3008');
});
