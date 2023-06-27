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


app.get('/callback', (req, res) => {
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
                min_popularity: 50,
                limit: 8 // Adjust the limit according to your preference
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

      searchSongsByGenre('your_genre_here') // Replace 'your_genre_here' with the desired genre
        .then(function (tracks) {
          console.log("Tracks:");
          for (let track of tracks) {
            console.log(track.name + " : " + track.artists[0].name);
          }
        })
        .catch(function (err) {
          console.log('Something went wrong!', err);
        });

      res.send('Access token request initiated.');
    })
    .catch(function (error) {
      console.error('Error getting Tokens:', error);
      res.send(`Error getting Tokens: ${error}`);
    });
});

app.listen(3008, () => {
  console.log('Server listening on port 3008');
});
