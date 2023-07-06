// database.js

const Songs = require('./models/Songs');
const Users = require('./models/Users');

// Import the necessary models and dependencies

// Function to insert songs into the 'songs' table
async function insertSongs(tracks) {
  try {
    await Songs.bulkCreate(tracks);
    console.log('Songs inserted successfully');
  } catch (error) {
    console.log('Error inserting songs:', error);
    throw error;
  }
}

module.exports = {
  insertSongs
};
