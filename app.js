const fs = require('fs'); 

const SpotifyWebApi = require('spotify-web-api-node'); // Importing the SpotifyWebApi module
const token = "XXXXXX"; // Access token, can acess this once the server is started 

const spotifyApi = new SpotifyWebApi(); 
spotifyApi.setAccessToken(token); // Setting the access token for the API instance

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
          limit: 8 // Adjust this based on user choice 
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

searchSongsByGenre('your_genre_here') // Have to replace this with the user genre 
  .then(function (tracks) {
    console.log("Tracks:");
    for (let track of tracks) {
      console.log(track.name + " : " + track.artists[0].name);
    }
  })
  .catch(function (err) {
    console.log('Something went wrong!', err);
  });
