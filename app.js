const fs = require('fs');
const fetch = require('node-fetch');
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
const app = express();

var client_id = process.env.Id;
var client_secret = process.env.Secret;

var authOptions = {
  url: 'https://accounts.spotify.com/api/token',
  method: 'POST',
  headers: {
    'Authorization': 'Basic ' + (Buffer.from(client_id + ':' + client_secret).toString('base64')),
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: 'grant_type=client_credentials'
};

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(express.json());

app.get('/callback', (req, res) => {
  // Handle the callback logic here
  const { genre, popularity, numSongs } = req.query;

  if (!genre || !popularity || !numSongs) {
    res.status(400).json({ error: 'Genre, popularity, and numSongs are required' });
    return;
  }

  // Make the token request
  fetch(authOptions.url, {
    method: 'POST',
    headers: authOptions.headers,
    body: authOptions.body
  })
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error('Request failed with status ' + response.status + ': ' + response.statusText);
      }
    })
    .then(function (body) {
      var token = body.access_token;
      var spotifyApi = new SpotifyWebApi();
      spotifyApi.setAccessToken(token);

      function searchSongsByGenre(genre) {
        return new Promise((resolve, reject) => {
          // Get Available Genre Seeds
          spotifyApi.getAvailableGenreSeeds()
            .then(function (data) {
              let genreSeeds = data.body.genres;
              if (!genreSeeds.includes(genre)) {
                reject(`Genre '${genre}' is not available.`);
              }

              // Get Recommendations Based on Seeds
              spotifyApi.getRecommendations({
                seed_genres: [genre],
                min_popularity: parseInt(popularity), // Convert to integer
                limit: parseInt(numSongs) // Convert to integer
              })
                .then(function (data) {
                  let tracks = data.body.tracks;
                  resolve(tracks);
                })
                .catch(function (err) {
                  reject(err);
                });
            })
            .catch(function (err) {
              reject(err);
            });
        });
      }

      searchSongsByGenre(genre)
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
    })
    .catch(function (error) {
      console.error('Error getting Tokens:', error);
      res.status(500).json({ error: 'Error getting tokens' });
    });
});

app.listen(3008, () => {
  console.log('Server listening on port 3008');
});
