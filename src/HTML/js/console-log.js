// Override console.log
const originalConsoleLog = console.log;

console.log = function (message) {
	originalConsoleLog(message);

	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		const logMessage = document.createElement('div');

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
