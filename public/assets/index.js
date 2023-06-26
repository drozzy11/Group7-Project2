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