var image = new Image();
var i = 1;
var imageDrag = false;

var off = $('#mainCanvas').offset();

// ドラッグ開始位置
let start = {
  x: 0,
  y: 0
};
// ドラッグ中の位置
let diff = {
  x: 0,
  y: 0
};
// ドラッグ終了後の位置
let end = {
  x: 0,
  y: 0
}

$(function(){
  init();
});

function init() {
  var mainCanvas =  document.getElementById("mainCanvas");
  var ctx = mainCanvas.getContext("2d");

  ctx.fillStyle = '#e9e9e9';
  ctx.fillRect(10, 10, 380, 380);

  var text = "画像をセットしてください";
  ctx.font = '20px Impact';
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillText(text, 85, 210);

  var mainCanvas =  document.getElementById("subCanvas");
  var ctx = mainCanvas.getContext("2d");

  ctx.fillStyle = '#e9e9e9';
  ctx.fillRect(10, 10, 380, 380);

  var text = "画像をセットしてください";
  ctx.font = '20px Impact';
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillText(text, 85, 210);
}

$("#uploadFile").change(function() {
  var mainCanvas =  document.getElementById("mainCanvas");
  var ctx = mainCanvas.getContext("2d");

  var copyCanvas =  document.getElementById("copyCanvas");
  var ctxCopy = copyCanvas.getContext("2d");

  var subCanvas =  document.getElementById("subCanvas");
  var subCtx = subCanvas.getContext("2d");

    // 選択されたファイルを取得
    var file = this.files[0];
    // 画像ファイル以外は処理中止
    if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;

    var reader = new FileReader();
    // ローカルファイルを読み込む。読み込み完了後に実行
    reader.onload = function(evt) {
      // 画像がloadされた後に、canvasに描画
      image.onload = function() {
        ctx.clearRect(0,0,400,400);
        ctx.drawImage(image, 0, 0, image.width, image.height);
        copy = ctx.getImageData(200,200,50,50);

        // 拡大範囲のフレーム描画
        ctx.strokeStyle = '#ff0000';
        ctx.strokeRect(200, 200, 50, 50);

        // 拡大したものを描画
        ctxCopy.putImageData(copy, 0,0);
        subCtx.clearRect(0,0,400,400);
        subCtx.drawImage(copyCanvas, 0, 0, 400, 400);
      }

      mainCanvas.addEventListener("mousemove", function(e){
        if (imageDrag) {
          diff.x = (event.clientX - start.x) + end.x;
          diff.y = (event.clientY - start.y) + end.y;
          ctx.fillStyle = "#fcfcfc";
          ctx.fillRect(0,0,480,600);
          ctx.drawImage(image,diff.x,diff.y,image.width*i,image.height*i);

          subCtx.fillStyle = "#fcfcfc";
          subCtx.fillRect(0,0,480,600);
          copy = ctx.getImageData(200, 200, 50, 50);
          ctxCopy.putImageData(copy, 0,0);
          subCtx.fillStyle = "#fcfcfc";
          subCtx.fillRect(0, 0, 480, 600);
          subCtx.drawImage(copyCanvas, 0, 0, 400, 400);

          // 拡大範囲のフレーム描画
          ctx.strokeStyle = '#ff0000';
          ctx.strokeRect(200, 200, 50, 50);

        }
      });
      mainCanvas.addEventListener("mouseup",function(e){
        imageDrag = false;
        end.x = diff.x;
        end.y = diff.y;
      });
      mainCanvas.addEventListener("mousedown",function(e){
        imageDrag = true;
        start.x = event.clientX;
        start.y = event.clientY;
      });
      mainCanvas.addEventListener("mouseleave",function(){
        imageDrag = false;
      });

      subCanvas.addEventListener("click" ,function(e){
        var rect = e.target.getBoundingClientRect();
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
        var pixel = subCtx.getImageData(x, y, 1, 1);
        var data = pixel.data;
        var rgba = 'rgba(' + data[0] + ',' + data[1] +
             ',' + data[2] + ',' + (data[3] / 255) + ')';
        var pixel = document.getElementById('pixel');
        pixel.style.background = rgba;
        $("#r").val(data[0]);
        $("#g").val(data[1]);
        $("#b").val(data[2]);
      });

      // 画像のURLをソースに設定
      image.src = evt.target.result;
    }
    // ファイルを読み込み、データをBase64でエンコードされたデータURLにして返す
    reader.readAsDataURL(file);
});

// 拡大
$("#enlargeBtn").on('click', function() {
  if(i<1) {
    i=i+0.05;
  } else {
      i=i+1;
  }
  var mainCanvas =  document.getElementById("mainCanvas");
  var ctx = mainCanvas.getContext("2d");

  var copyCanvas =  document.getElementById("copyCanvas");
  var ctxCopy = copyCanvas.getContext("2d");

  var subCanvas =  document.getElementById("subCanvas");
  var subCtx = subCanvas.getContext("2d");

  ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  ctx.save();
  ctx.drawImage(image, 0, 0, image.width*i, image.height*i);

  ctxCopy.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  ctxCopy.save();
  subCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
  subCtx.save();
  copy = ctx.getImageData(200, 200, 50, 50);
  ctxCopy.putImageData(copy, 0,0);
  subCtx.drawImage(copyCanvas, 0, 0, 400, 400);

  // 拡大範囲のフレーム描画
  ctx.strokeStyle = '#ff0000';
  ctx.strokeRect(200, 200, 50, 50);
});

// 縮小
$("#scaleDownBtn").on('click', function() {
  if(i==0.05) {

  }else {
    if(i > 1) {
      i=i-1;
    } else {
      i=i-0.05;
    }

    var mainCanvas =  document.getElementById("mainCanvas");
    var ctx = mainCanvas.getContext("2d");

    var copyCanvas =  document.getElementById("copyCanvas");
    var ctxCopy = copyCanvas.getContext("2d");

    var subCanvas =  document.getElementById("subCanvas");
    var subCtx = subCanvas.getContext("2d");

    ctx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctx.save();
    ctx.drawImage(image, 0, 0, image.width*i, image.height*i);

    ctxCopy.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    ctxCopy.save();
    subCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
    subCtx.save();
    copy = ctx.getImageData(200, 200, 50, 50);
    ctxCopy.putImageData(copy, 0,0);
    subCtx.drawImage(copyCanvas, 0, 0, 400, 400);

    // 拡大範囲のフレーム描画
    ctx.strokeStyle = '#ff0000';
    ctx.strokeRect(200, 200, 50, 50);
  }
});
