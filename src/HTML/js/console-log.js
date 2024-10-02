// import {version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {version} from 'http://127.0.0.1:5500/dist/async-monitor.esm.js';

const originalConsoleLog = console.log;
const originalConsoleClear = console.clear;
const date0 = Date.now();
console.log = function (message) {
	originalConsoleLog(message);

	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		const logTimestamp = document.createElement('pre');
		logTimestamp.textContent = Date.now() - date0;
		consoleDiv.appendChild(logTimestamp);

		const logMessage = document.createElement('pre');
		if (typeof message === 'object')
			try {
				message = JSON.stringify(message, undefined, 4);
			} catch (error) {
				message = Object.keys(message);
			}

		logMessage.textContent = message;
		consoleDiv.appendChild(logMessage);
	}
};

console.clear = function () {
	originalConsoleClear();

	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		consoleDiv.innerHTML = '';
	}

	console.log(`version: ${version}`);
	console.log('');
};
