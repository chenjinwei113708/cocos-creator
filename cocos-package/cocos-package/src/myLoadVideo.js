function dataURItoBlob(dataURI) {
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]; // mime类型
  var byteString = atob(dataURI.split(',')[1]); //base64 解码
  var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
  var intArray = new Uint8Array(arrayBuffer); //创建视图
  for (var i = 0; i < byteString.length; i++) {
    intArray[i] = byteString.charCodeAt(i);
  }
  return new Blob([intArray], {
    type: mimeString
  });
}

function myLoadVideo() {
  setTimeout(function(){
    var videos = document.getElementsByClassName('cocosVideo');
    if (videos && videos.length >= 1) {
      console.log('my load video');
      for (var i = 0; i < videos.length; i++) {
        var source = videos[i].getElementsByTagName('source');
        var originUrl = source[0].src.match(/res[/0-9a-zA-Z-]+.mp4/s);
        if (!originUrl) return;
        originUrl = originUrl[0];
        var videoBlob = dataURItoBlob("data:video/mp4;base64," + window.res[originUrl]);
        // console.log('source :', originUrl);
        source[0].src = URL.createObjectURL(videoBlob);
        source[0].type = 'video/mp4';
        var blobSource = document.createElement("SOURCE");
        blobSource.src = "data:video/mp4;base64," + window.res[originUrl];
        blobSource.type = 'video/mp4';
        videos[i].appendChild(blobSource);
        videos[i].load();
      }
    }
  }, 100);
  
}