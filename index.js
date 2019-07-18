'use strict';
const path = require('path');
const {app, BrowserWindow, Menu, ipcMain,dialog } = require('electron');
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
		height: 400,
		webPreferences: {
			plugins: true,
			webSecurity:true,
			allowDisplayingInsecureContent:true,
			allowRunningInsecureContent:true,
		}
	});

	win.on('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		// Dereference the window
		// For multiple windows store them in an array
		mainWindow = undefined;
	});

	await win.loadFile(path.join(__dirname, 'index.html'));
	// win.loadURL('http://localhost:8080/');

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
let printer = null
let device = null
try{
	device  = new escpos.USB(0x6868,0x0200);
	const options = { encoding: "GB18030" /* default */ }
	printer = new escpos.Printer(device, options);
}catch(e){
	dialog.showErrorBox("提示", "小票机没有连接")
}

let print = (evt,data)=>{
	let _data = decodeURIComponent(data)

	_data = _data.substring(0, _data.length-1)
	let value2 = `
		(function(p1, that){			
			p1${_data}, function(err){
				p1.cut();
				p1.close();	
			})
		})
	`
	console.log(value2)	
	device.open(function(){
		
		try{
			let fn = eval(value2)
			console.log(fn)
			fn(printer,this)
		}catch(e){
			console.log(e)
		}
		
	});
}
ipcMain.on('printtest', print )
