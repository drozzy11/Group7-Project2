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
document.querySelector('#playlistBtn','.login-btn').addEventListener('click', () => {
  document.querySelector('#playlistBtn','.login-btn').classList.add('.homeOnCLick');
}); 

document.querySelector('.micIcon').addEventListener('click', () => {
  document.querySelector('.navbar-collapse').classList.toggle('show');
});