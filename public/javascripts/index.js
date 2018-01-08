$(function(){
  hide();
});

function test() {
  var q = $('#q-account').text();
  if(q == "Don't have an account?") {
    $('.login').hide();
    $('.signup').show();
    $('#q-account').text("Have an account?");
    $('#change-form').text("Log in");
  } else {
    $('.login').show();
    $('.signup').hide();
    $('#q-account').text("Don't have an account?");
    $('#change-form').text("Sign up");
  }
  /*
  $.get('test', function(test){
  });*/
}

function hide() {
  $('.signup').hide();
}
