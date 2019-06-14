const { app, path, BrowserWindow, Tray, Menu, MenuItem } = require('electron');
const storage = require('electron-json-storage');

let mainWindow;
let appTray = null;
let minsSinceLastPopup = 0;
let menu;
let options = {
	isPlaySounds: true,
	isRunOnStartup: true
};

storage.get('options', function(error, data) {
	if (error) throw error;
	if (!!data) {
		options = data;
	}
	setupTrayIcon();
});

app.on('ready', () => {
	setInterval(popup, 1000 * 60);
});

global.getSoundValue = function() {
	return options.isPlaySounds;
};

function setupTrayIcon() {
	appTray = new Tray('resources/trayicon.png');

	setTrayIconText();

	menu = new Menu();
	menu.append(
		new MenuItem({
			label: 'Sound',
			type: 'checkbox',
			checked: options.isPlaySounds,
			click(menuitem) {
				options.isPlaySounds = menuitem.checked;
				updateStorage();
			}
		})
	);

	menu.append(
		new MenuItem({
			label: 'Run At Startup: ',
			type: 'checkbox',
			checked: options.isRunOnStartup,
			click(menuitem) {
				options.isRunOnStartup = menuitem.checked;
				setupRunAtStartup(menuitem.checked);
				updateStorage();
			}
		})
	);

	menu.append(
		new MenuItem({
			label: 'Reset Timer',
			click() {
				minsSinceLastPopup = 0;
				setTrayIconText();
			}
		})
	);

	menu.append(
		new MenuItem({
			label: 'Quit',
			click() {
				app.quit();
			}
		})
	);
	appTray.setContextMenu(menu);
}

function updateStorage() {
	storage.set('options', options, function(error) {
		if (error) throw error;
	});
}

function setTrayIconText() {
	appTray.setToolTip('' + (20 - minsSinceLastPopup));
}

function setupRunAtStartup(isRunAtStartup) {
	app.setLoginItemSettings({
		openAtLogin: isRunAtStartup,
		path: require('electron').app.getPath('exe')
	});
}

function popup() {
	minsSinceLastPopup++;
	setTrayIconText();
	if (minsSinceLastPopup < 20) {
		return;
	}

	popupWindow();

	minsSinceLastPopup = 0;
}

function popupWindow() {
	if (mainWindow == null) {
		mainWindow = new BrowserWindow({
			width: 120,
			height: 100,
			frame: false,
			show: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			},
			backgroundColor: '#ff4444'
		});

		mainWindow.loadURL('file://' + __dirname + '/popup/index.html');

		mainWindow.on('closed', () => {
			mainWindow = null;
		});

		mainWindow.once('ready-to-show', () => {
			mainWindow.show();
		});
	}
}
