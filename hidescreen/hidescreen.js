document.querySelector('body').addEventListener('click', function(e) {
	var electron = require('electron');
	var displayWindow = electron.remote.getCurrentWindow();
	displayWindow.close();
});
