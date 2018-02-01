var socket = io();

$(function() {
  init();
});

function init() {
  $.get('user', function(user) {
    socket.emit('moveBattleS', {
      name:user.name,
      socketId:''
    });
  });
}

socket.on('roomConnect', function(user) {
  //部屋番号送信・初期表示
  var roomId =  $("#roomId").text();
  socket.emit('roomInit', {
    name:user.name,
    socketId:'',
    room: roomId
  });
});
