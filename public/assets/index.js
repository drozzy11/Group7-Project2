// Modal
$(function() {
    $('.login-btn').click(function() {
      $('#modalLoginForm').modal('show');
    });
  }); 

  // close modal
    $(function() {
    $('.close').click(function() {
      $('#modalLoginForm').modal('hide');
    });
    });

//Home page styling functions
document.querySelector('#playlistBtn','#login-btn').addEventListener('click', () => {
  document.querySelector('#playlistBtn','#login-btn').classList.add('.homeOnCLick');
}); 

document.querySelector('.micIcon').addEventListener('click', () => {
  document.querySelector('.navbar-collapse').classList.toggle('show');
});

//------------------//

//playlist page styling functions

// Get the dropdown element
const genreSelect = document.getElementById('genre-select');
// Get the playlist title element
const playlistTitle = document.getElementById('playlist-title');
// Add an event listener to the dropdown
genreSelect.addEventListener('change', function() {
  // Get the selected value from the dropdown
  const selectedGenre = genreSelect.value;

  // Update the playlist title with the selected genre
  playlistTitle.textContent = `${selectedGenre} Playlist`;
});

// hide and show playlist

document.querySelector('#generate-playlist-btn').addEventListener('click', () => {
  document.querySelector('#playlist-container').classList.remove('hide');
  document.querySelector('#generate-playlist-btn').classList.add('hide');
});