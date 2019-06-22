'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain} = require('electron');
/// const {autoUpdater} = require('electron-updater');
const {is} = require('electron-util');
const unhandled = require('electron-unhandled');
const debug = require('electron-debug');
const contextMenu = require('electron-context-menu');
const config = require('./config');


unhandled();
debug();
contextMenu();

// Note: Must match `build.appId` in package.json
app.setAppUserModelId('com.kongzhong.cashier');

// Uncomment this before publishing your first version.
// It's commented out as it throws an error if there are no published versions.
// if (!is.development) {
// 	const FOUR_HOURS = 1000 * 60 * 60 * 4;
// 	setInterval(() => {
// 		autoUpdater.checkForUpdates();
// 	}, FOUR_HOURS);
//
// 	autoUpdater.checkForUpdates();
// }

// Prevent window from being garbage collected
let mainWindow;

const createMainWindow = async () => {
	const win = new BrowserWindow({
		title: app.getName(),
		show: false,
		width: 600,
		height: 400
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	//await win.loadFile(path.join(__dirname, 'index.html'));
	win.loadURL('https://vrpos.kongzhong.com/');

	return win;
};


const menu = require('./menu');

// Prevent multiple instances of the app
if (!app.requestSingleInstanceLock()) {
	app.quit();
}

app.on('second-instance', () => {
	if (mainWindow) {
		if (mainWindow.isMinimized()) {
			mainWindow.restore();
		}

		mainWindow.show();
	}
});

app.on('window-all-closed', () => {
	if (!is.macos) {
		app.quit();
	}
});

app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

(async () => {
	await app.whenReady();
	Menu.setApplicationMenu(menu);
	mainWindow = await createMainWindow();

	//const favoriteAnimal = config.get('favoriteAnimal');
	//mainWindow.webContents.executeJavaScript(`document.querySelector('header p').textContent = 'Your favorite animal is ${favoriteAnimal}'`);
})();

//----------------------------
const escpos = require('./escpos');
const device  = new escpos.USB(0x6868,0x0200);
const options = { encoding: "GB18030" /* default */ }
const printer = new escpos.Printer(device, options);

let print = (data)=>{
	console.log("go print test")
	device.open(function(){
		printer
		.font('a')
		.align('ct')
		.style('bu')
		.size(1, 1)
		.text('The quick brown fox jumps over the lazy dog')
		.text('敏捷的棕色狐狸跳过懒狗')
		.barcode('1234567', 'EAN8')
		.qrimage('https://github.com/song940/node-escpos', function(err){
		  this.cut();
		  this.close();
		});
	});
}
ipcMain.on('printtest', print )