'use strict';
const path = require('path');
const { app, Menu, shell} = require('electron');
const {
	is,
	appMenu,
	aboutMenuItem,
	openUrlMenuItem,
	openNewGitHubIssue,
	debugInfo
} = require('electron-util');
const config = require('./config');

const showPreferences = () => {
	// Show the app's preferences here
};

const helpSubmenu = [
	openUrlMenuItem({
		label: '官网',
		url: 'https://www.kongzhong.com'
	}),
	openUrlMenuItem({
		label: '联系我们',
		url: 'https://www.kongzhong.com'
	})
	
];

if (!is.macos) {
	helpSubmenu.push(
		{
			type: 'separator'
		},
		aboutMenuItem({
			title : '关于我们',
			text : '啦啦啦',
			icon: path.join(__dirname, 'static', 'icon.png'),
			text: '空中研发团队'
		})
	);
}

const debugSubmenu = [
	{
		label: '打印测试',
		click() {
			app.print("printtest")
		}
	},
	{
		label: 'Show Settings',
		click() {
			config.openInEditor();
		}
	},
	{
		label: 'Show App Data',
		click() {
			shell.openItem(app.getPath('userData'));
		}
	},
	{
		type: 'separator'
	},
	{
		label: 'Delete Settings',
		click() {
			config.clear();
			app.relaunch();
			app.quit();
		}
	},
	{
		label: 'Delete App Data',
		click() {
			shell.moveItemToTrash(app.getPath('userData'));
			app.relaunch();
			app.quit();
		}
	}
];

const macosTemplate = [
	appMenu([
		{
			label: 'Preferences…',
			accelerator: 'Command+,',
			click() {
				showPreferences();
			}
		}
	]),
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom'
			},
			{
				type: 'separator'
			},
			{
				role: 'close'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'windowMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

// Linux and Windows
const otherTemplate = [
	{
		role: 'fileMenu',
		submenu: [
			{
				label: 'Custom'
			},
			{
				type: 'separator'
			},
			{
				label: 'Settings',
				accelerator: 'Control+,',
				click() {
					showPreferences();
				}
			},
			{
				type: 'separator'
			},
			{
				label :'退出', 
				role: 'quit'
			}
		]
	},
	{
		role: 'editMenu'
	},
	{
		role: 'viewMenu'
	},
	{
		role: 'help',
		submenu: helpSubmenu
	}
];

const template = process.platform === 'darwin' ? macosTemplate : otherTemplate;


if (is.development) {
	template.push({
		label: '调试',
		submenu: debugSubmenu
	});
}

module.exports = Menu.buildFromTemplate(template);
