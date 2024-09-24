const {
  ipcRenderer,
} = require('electron');

const remote = require('@electron/remote');

const {
  $,
  chromeMediaSourceId,
  currentWidth,
  currentHeight
} = require('./getCurWin');

const {
  cut
} = require('./render');

const imgDom = $('screenImg');
const mask = $('mask');

const iswin32 = process.platform == 'win32';
const islinux = process.platform == 'linux';

// retina显示屏和普通显示屏
const ratio = window.devicePixelRatio || 1;

const currentWindow = remote.getCurrentWindow();
const isAero = remote.getGlobal('isAero');

// handleError
function handleError(error) {
  console.error(`${error.errmsg || error.toString()}`);
}

// handleStream
function handleStream(stream) {
  let video = document.createElement('video');
  
  video.addEventListener('loadedmetadata', () => {
    // 必须要加play => https://github.com/electron/electron/issues/21063
    video.play();
    // 创建canvas
    let canvas = document.createElement('canvas');
    canvas.width = currentWidth * ratio;
    canvas.height = currentHeight * ratio;
    canvas.style.width = currentWidth + 'px';
    canvas.style.height = currentWidth + 'px';
    
    let ctx = canvas.getContext('2d');
    ctx.scale(ratio, ratio)
    
    ctx.drawImage(video, 0, 0, currentWidth, currentHeight);
    video.remove();
    
    // 操作img
    imgDom.style.cssText += 'width: ' + currentWidth + 'px; height: ' + currentHeight + 'px;display:block;';
    imgDom.src = canvas.toDataURL();
    mask.style.cssText += 'opacity: 1';
    
    // 对Windows的基本主题和高对比度主题单独处理，因为它不支持transparent
    if (iswin32 && !isAero) {
      currentWindow.setOpacity(1.0);
    }
    // 触发截图
    cut();
    
  }, false);
  
  video.srcObject = stream;
  video.style.visibility = 'hidden';
  document.body.appendChild(video);
}


// 创建蒙版窗口
function getUserMedia(id) {
  navigator.mediaDevices.getUserMedia({
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: id,
        width: { ideal: 19200 },
        height: { ideal: 10800 }
      }
    }
  }).then(stream => {
    handleStream(stream);
  }).catch(error => {
    handleError(error);
  });
}


// 避免偶尔的截取的全屏图片带有mask透明，不是清晰的全屏图
mask.style.cssText += 'opacity:0';

// 防止截图不截取任何区域，直接双击拷贝，拷贝的是上次截的图
localStorage.cutImgUrl = '';

// if (iswin32) {
// 	mask.style.cssText += 'opacity:0';
// 	// setTimeout(() => {
// 	getUserMedia(`screen:${chromeMediaSourceId}`);
// 	// }, 0);
// } else {
getUserMedia(`screen:${chromeMediaSourceId}`);
// }