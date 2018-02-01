var socket = io();

$(function() {
  var name = $('#userName').text();
  setIcon();
  $.get('user', function(user) {
    socket.emit('login', {
      name:user.name,
      hairColor:user.hairColor,
      eyeColor:user.eyeColor,
      faceColor:user.faceColor,
      backColor:user.backColor,
      socketId:''
    });
  });
});

// ログイン
socket.on('login', function(user) {
  var users = document.getElementById('users');
  var newUser = document.createElement('li');
  newUser.innerHTML = `<div class="col-md-12 text-center" id="opponentUserBox"><row><div class="opponentInfo col-md-12"><canvas id="originalImg" width="60" height="60"></canvas><canvas id="opponentImg" width="60" height="60"></canvas></div><div class="col-md-12"><h6>${user.name}</h6></div><div clas="col-md-12"><div class="row"><div class="col-md-5 offset-md-1"><h6>勝利 : 0</h6></div><div class="col-md-5"><h6>敗北 : 0</h6></div></div><button id="${user.socketId}" class="applyBtn btn btn-primary btn-sm" onClick="apply(this);">申し込む</button></div></row></div>`;
  newUser.className = 'list-inline-item';
  newUser.id = user.socketId;
  users.insertBefore(newUser, users.firstChild);

  opponentSetIcon(user);
});

// 全員の画面から自分に関する情報削除
socket.on('disconne', function(id) {
  $(`#users li#${id}`).remove();
  $(`#apply_users li#${id}`).remove();
});

// バトルの申請
function apply(button) {
  $(`button#${button.id}`).text("申請中");
  var name = $('#userName').text();
  $.get('user', function(user) {
    socket.emit('apply', {
      name:name,
      id:button.id,
      ownId:'',
    });
  });
  $(`button#${button.id}`).prop("disabled", true);
}

//
socket.on('getApply', function(opponent) {
  var users = document.getElementById('apply_users');
  var newUser = document.createElement('li');
  newUser.innerHTML = `<div class="col-md-12 text-center" id="opponentUserBox"><row><div class="col-md-12"><p>${opponent.name}から戦いの申請があります</p></div><div class="col-md-12"><button id=${opponent.ownId} class="btn btn-primary" onClick="accept(this);">受ける</button></div></row></div>`;
  newUser.id = opponent.ownId;
  users.insertBefore(newUser, users.firstChild);
});

// オセロ画面遷移
function accept(button) {
  var min = 0 ;
  var max = 151 ;
  var a = Math.floor( Math.random() * (max + 1 - min) ) + min ;
  $("#roomId").val(a);
  socket.emit('acceptBattle', {
    id:button.id,
    roomId:a
  });
  var url = '/battle?roomId=' + a;
  window.location.href = url;
}

//
socket.on('battle', function(room) {
  var url = '/battle?roomId=' + room.roomId;
  window.location.href = url;
});

function setIcon() {
  var mainCanvas =  document.getElementById("userImg");
  var ctx = mainCanvas.getContext("2d");
  var img = new Image();
  img.src = "images/yamada.png";
  img.onload = function() {
    $.get('user', function(user) {
      ctx.drawImage(img, 0, 0, 150, 150);
      var imagedata = ctx.getImageData(0, 0, 150, 150);

      // ユーザーアイコン作成
      for(var y=0; y<imagedata.height; y++) {
        for(var x=0; x<imagedata.width; x++) {
          var index = (y*imagedata.width+x)*4;
          if(imagedata.data[index] == 255 && imagedata.data[index+1] == 255) { // 髪
            imagedata.data[index] = user.hairColor[0];
            imagedata.data[index+1] = user.hairColor[1];
            imagedata.data[index+2] = user.hairColor[2];
          } else if(imagedata.data[index] == 186 && imagedata.data[index+1] == 0) { // 背景
            imagedata.data[index] = user.backColor[0];
            imagedata.data[index+1] = user.backColor[1];
            imagedata.data[index+2] = user.backColor[2];
          } else if(imagedata.data[index] == 255 && imagedata.data[index+1] == 192) { // 顔
            imagedata.data[index] = user.faceColor[0];
            imagedata.data[index+1] = user.faceColor[1];
            imagedata.data[index+2] = user.faceColor[2];
          } else { // 目
            imagedata.data[index] = user.eyeColor[0];
            imagedata.data[index+1] = user.eyeColor[1];
            imagedata.data[index+2] = user.eyeColor[2];
          }
        }
      }

      var test =  document.getElementById("testImg");
      var testCtx = test.getContext("2d");
      testCtx.putImageData(imagedata, 0, 0);
    });
  }
}


function opponentSetIcon(user) {
  var mainCanvas =  document.getElementById("originalImg");
  var ctx = mainCanvas.getContext("2d");
  var img = new Image();
  img.src = "images/yamada.png";
  img.onload = function() {

      ctx.drawImage(img, 0, 0, 60, 60);
      var imagedata = ctx.getImageData(0, 0, 60, 60);

      // ユーザーアイコン作成
      for(var y=0; y<imagedata.height; y++) {
        for(var x=0; x<imagedata.width; x++) {
          var index = (y*imagedata.width+x)*4;
          if(imagedata.data[index] == 255 && imagedata.data[index+1] == 255) { // 髪
            imagedata.data[index] = user.hairColor[0];
            imagedata.data[index+1] = user.hairColor[1];
            imagedata.data[index+2] = user.hairColor[2];
          } else if(imagedata.data[index] == 186 && imagedata.data[index+1] == 0) { // 背景
            imagedata.data[index] = user.backColor[0];
            imagedata.data[index+1] = user.backColor[1];
            imagedata.data[index+2] = user.backColor[2];
          } else if(imagedata.data[index] == 255 && imagedata.data[index+1] == 192) { // 顔
            imagedata.data[index] = user.faceColor[0];
            imagedata.data[index+1] = user.faceColor[1];
            imagedata.data[index+2] = user.faceColor[2];
          } else { // 目
            imagedata.data[index] = user.eyeColor[0];
            imagedata.data[index+1] = user.eyeColor[1];
            imagedata.data[index+2] = user.eyeColor[2];
          }
        }
      }

      var test =  document.getElementById("opponentImg");
      var testCtx = test.getContext("2d");
      testCtx.putImageData(imagedata, 0, 0);

  }
}
