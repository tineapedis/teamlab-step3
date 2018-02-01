$(function(){
  init();
});

function init() {
  var val = getUrlVars();
  setIcon();
  getColorList();
}

function setIcon() {
  var mainCanvas =  document.getElementById("userImg");
  var ctx = mainCanvas.getContext("2d");
  var img = new Image();
  img.src = "images/yamada.png";
  img.onload = function() {
    $.get('user', function(user) {

      $('#userName').text(user.name);
      $('#colorNumber').text(`カラー${user.colors.length}個`);

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

var iconColorId = '';
var listColorId = '';
function getColorList() {
  iconColorId = '';
  var $color = $('.colorRow');
  var i=0;
  $.get('user', function(user) {
    $.get('colorlist', function(colors) {
      if(colors.length != 0) {
        for(var i=0 ; i < colors.length ; i++) {
          if(user._id == colors[i].user) {
            $color.append('<div class="col-md-4 color text-center"><canvas id="' + colors[i]._id + '" width="250" height="250"></canvas>'+'</div>');
            var canvas =  document.getElementById(colors[i]._id);
            var ctx = canvas.getContext("2d");
            ctx.fillStyle = 'rgba('+colors[i].r+',' + colors[i].g + ','+ colors[i].b +', 1.0)';
            ctx.fillRect(20, 20, 210, 210);
            canvas.addEventListener("click" ,function(e) {
              var id =  $(this).attr("id");

              for(var i=0 ; i < colors.length ; i++) {
                if(user._id == colors[i].user) {
                  var elseCanvas =  document.getElementById(colors[i]._id);
                  var ctx = elseCanvas.getContext("2d");
                  ctx.clearRect(0, 0, canvas.width, canvas.height);
                  ctx.fillRect(20, 20, 210, 210);
                }
              }
              var id =  $(this).attr("id");
              listColorId = id;
              var clickCanvas =  document.getElementById(id);
              var ctx = clickCanvas.getContext("2d");
              ctx.fillRect(0, 0, 250, 250);
            });
          }
        }
      }
    });
  });
}

function editIcon() {
  $('.btnBox').html('');
  $('.countBox').html('');
  $.get('user', function(user) {
    for(var i=0 ; i < 4 ; i++) {
      if(i == 0) {
        $('.countBox').append('<div class="col-md-1 offset-md-1 iconCanvas"><canvas id="backColor" width="50" height="50"></canvas></div>');
        var canvas =  document.getElementById("backColor");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgba('+user.backColor[0]+',' + user.backColor[1] + ','+ user.backColor[2] +', 1.0)';
      } else if(i == 1) {
        $('.countBox').append('<div class="col-md-1 offset-md-1 iconCanvas"><canvas id="faceColor" width="50" height="50"></canvas></div>');
        var canvas =  document.getElementById("faceColor");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgba('+user.faceColor[0]+',' + user.faceColor[1] + ','+ user.faceColor[2] +', 1.0)';
      } else if(i == 2) {
        $('.countBox').append('<div class="col-md-1 offset-md-1 iconCanvas"><canvas id="hairColor" width="50" height="50"></canvas></div>');
        var canvas =  document.getElementById("hairColor");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgba('+user.hairColor[0]+',' + user.hairColor[1] + ','+ user.hairColor[2] +', 1.0)';
      } else {
        $('.countBox').append('<div class="col-md-1 offset-md-1 iconCanvas"><canvas id="eyeColor" width="50" height="50"></canvas></div>');
        var canvas =  document.getElementById("eyeColor");
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = 'rgba('+user.eyeColor[0]+',' + user.eyeColor[1] + ','+ user.eyeColor[2] +', 1.0)';
      }
      ctx.fillRect(5, 5, 35, 35);

      canvas.addEventListener("click" ,function(e){
        for(var i=0 ; i < 4 ; i++) {
          if(i==0) {
            var elseCanvas =  document.getElementById("backColor");
          } else if(i==1) {
            var elseCanvas =  document.getElementById("faceColor");
          } else if(i==2) {
            var elseCanvas =  document.getElementById("hairColor");
          } else {
            var elseCanvas =  document.getElementById("eyeColor");
          }
          var ctx = elseCanvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.fillRect(5, 5, 35, 35);
        }
        var id =  $(this).attr("id");
        iconColorId = id;
        var clickCanvas =  document.getElementById(id);
        var ctx = clickCanvas.getContext("2d");
        ctx.fillRect(0, 0, 50, 50);
      });
    }

    $('.countBox').append('<form action="/editicon" method="post"> <input id="iconColorForm" type="text" name="iconColor" value=""> <input id="listColorForm" type="text" name="listColor" value="naoyuki"> <button type="submit" id="saveBtn" onClick="saveChange();">Save</button></form>');

  });
}

function saveChange() {
  $('#iconColorForm').val(iconColorId);
  $('#listColorForm').val(listColorId);
}

function logout() {
  $.get('logout', function() {
  });
  window.location.href = '/';
}

function getUrlVars()
{
    var vars = [], max = 0, hash = "", array = "";
    var url = window.location.search;
    hash  = url.slice(1).split('&');
    max = hash.length;
    for (var i = 0; i < max; i++) {
        array = hash[i].split('=');
        vars.push(array[0]);
        vars[array[0]] = array[1];
    }
    return vars;
}
