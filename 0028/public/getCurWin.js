const remote = require('@electron/remote');

const iswin32 = process.platform == 'win32';
const islinux = process.platform == 'linux';

// 获取所有窗口
const allWindows = remote.screen.getAllDisplays();

// get currentWindow
const currentWindow = remote.getCurrentWindow();
const bounds = currentWindow.getBounds() || {};

// 宽高
let currentWidth = bounds.width;
let currentHeight = bounds.height;

if (islinux) {
	currentWidth = bounds.width + bounds.x;
	currentHeight = bounds.height + bounds.y;
}

function $(id) {
	return document.getElementById(id);
}

// 获取屏幕id。可以根据desktopCapturer.getSources查看各个屏幕的ID
function getCurrentScreen() {
	let {
		x,
		y
	} = bounds;
	if (iswin32) {
		if (x == 0 && y == 0) {
			return {
				id: '0:0'
			};
		} else {
			return {
				id: '1:0'
			};
		}
	} else {
		let arr = allWindows.filter(item => item.bounds.x == x && item.bounds.y == y);
		let obj = arr[0] || {};
		return {
			id: obj.id + ':0'
		}
	}
}

exports.$ = $;
exports.chromeMediaSourceId = getCurrentScreen().id;
exports.currentWidth = currentWidth;
exports.currentHeight = currentHeight;