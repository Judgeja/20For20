const { BrowserWindow } = require('electron').remote;
const getPlaySoundValue = require('electron').remote.getGlobal('getSoundValue');

playSound();

document.getElementById('rest').addEventListener('click', function(e) {
	var electron = require('electron');
	var mainWindow = electron.remote.getCurrentWindow();

	let displays = electron.screen.getAllDisplays();

	let popups = [];

	for (let display of displays) {
		let popup = new BrowserWindow({
			x: display.bounds.x + 50,
			y: 50,
			fullscreen: true,
			frame: false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			},
			backgroundColor: '#000000'
		});
		popup.loadURL(`file://${__dirname}/hidescreen/index.html`);
		popups.push(popup);
	}

	setTimeout(x => {
		for (let popup of popups) {
			popup.close();
		}
		mainWindow.close();
	}, 20000);
});

document.getElementById('skip').addEventListener('click', function(e) {
	playSound();
	var electron = require('electron');
	var mainWindow = electron.remote.getCurrentWindow();
	mainWindow.close();
});

function playSound() {
	if (getPlaySoundValue()) {
		var audio = new Audio('../resources/beep.mp3');
		audio.play();
	}
}
