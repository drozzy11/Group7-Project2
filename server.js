const express = require('express');
const app = express();
const api = require('./api');

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
