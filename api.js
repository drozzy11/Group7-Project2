// api.js
const fetch = require('node-fetch');
require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

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

const spotifyApi = new SpotifyWebApi();

function searchSongsByGenre(genre, popularity, numSongs) {
  return new Promise((resolve, reject) => {
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
        spotifyApi.setAccessToken(token);

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
              min_popularity: parseInt(popularity),
              limit: parseInt(numSongs)
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
      })
      .catch(function (error) {
        console.error('Error getting Tokens:', error);
        reject('Error getting tokens');
      });
  });
}

// Export the necessary functions or variables
module.exports = {
  searchSongsByGenre,
  spotifyApi,
  authOptions
};
