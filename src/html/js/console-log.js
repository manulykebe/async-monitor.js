import {version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {version} from 'http://127.0.0.1:5500/dist/async-monitor.esm.js';

// Helper function to get current time in hh:mm:ss format
function getCurrentTime() {
	const now = new Date();
	return now.toTimeString().split(' ')[0]; // Returns time in hh:mm:ss format
}

// Helper function to create an HTML table from an object or array with separate columns for properties
function createTableFromObject(data) {
	const table = document.createElement('table');
	table.classList.add('log-table');

	if (Array.isArray(data) && data.length > 0) {
		// For arrays of objects, use the properties of the first object as the column headers
		const headerRow = document.createElement('tr');
		const keys = Object.keys(data[0]); // Get keys from the first object for header

		keys.forEach(key => {
			const th = document.createElement('th');
			th.textContent = key;
			th.classList.add('log-table-header');
			headerRow.appendChild(th);
		});
		table.appendChild(headerRow);

		data.forEach(item => {
			const row = document.createElement('tr');
			keys.forEach(key => {
				const td = document.createElement('td');
				td.textContent = typeof item[key] === 'object' ? JSON.stringify(item[key], undefined, 4) : item[key];
				td.classList.add('log-table-cell');
				row.appendChild(td);
			});
			table.appendChild(row);
		});
	} else if (typeof data === 'object') {
		// For a single object, display each key-value pair in its own row
		const headerRow = document.createElement('tr');
		const thKey = document.createElement('th');
		thKey.textContent = 'Property';
		thKey.classList.add('log-table-header');

		const thValue = document.createElement('th');
		thValue.textContent = 'Value';
		thValue.classList.add('log-table-header');

		headerRow.appendChild(thKey);
		headerRow.appendChild(thValue);
		table.appendChild(headerRow);

		Object.keys(data).forEach(key => {
			const row = document.createElement('tr');

			const keyCell = document.createElement('td');
			keyCell.textContent = key;
			keyCell.classList.add('log-table-cell');

			const valueCell = document.createElement('td');
			valueCell.textContent = typeof data[key] === 'object' ? JSON.stringify(data[key], undefined, 4) : data[key];
			valueCell.classList.add('log-table-cell');

			row.appendChild(keyCell);
			row.appendChild(valueCell);
			table.appendChild(row);
		});
	}
	return table;
}

const originalConsoleClear = console.clear;
const originalConsoleError = console.error;
const originalConsoleGroup = console.group;
const originalConsoleGroupEnd = console.groupEnd;
const originalConsoleLog = console.log;
const originalConsoleTable = console.table;
const originalConsoleWarn = console.warn;

function appendLogToConsole(time, message, classname) {
	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		const logEntry = document.createElement('div');
		logEntry.classList.add('log-entry');

		const timeCol = document.createElement('div');
		timeCol.classList.add('log-time');
		timeCol.textContent = time;

		const messageCol = document.createElement('div');
		messageCol.classList.add('log-message');
		if (classname) messageCol.classList.add(classname);

		if (typeof message === 'object') {
			const table = createTableFromObject(message);
			messageCol.appendChild(table);
		} else {
			const pre = document.createElement('pre');
			pre.classList.add('log-pre');
			pre.textContent = message;
			messageCol.appendChild(pre);
		}

		logEntry.appendChild(timeCol);
		logEntry.appendChild(messageCol);
		consoleDiv.appendChild(logEntry);
	}
}

console.clear = function () {
	originalConsoleClear();

	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		consoleDiv.innerHTML = '';
	}

	console.log(`async-monitor.js@${version}`);
};

console.log = function (message) {
	originalConsoleLog(message);
	appendLogToConsole(getCurrentTime(), message, message.startsWith('──') ? 'tree' : undefined);
};

console.error = function (message) {
	originalConsoleError(message);
	appendLogToConsole(getCurrentTime(), message, 'log-error');
};

console.group = function (label) {
	originalConsoleGroup(label);
	appendLogToConsole(getCurrentTime(), `${label}`, 'log-group');
};

console.groupEnd = function () {
	originalConsoleGroupEnd();
	appendLogToConsole('', '', 'log-group');
};

console.table = function (data) {
	originalConsoleTable(data);
	appendLogToConsole(getCurrentTime(), data);
};

console.warn = function (message) {
	originalConsoleWarn(message);
	appendLogToConsole(getCurrentTime(), message, 'log-warn');
};
function escapeRegExp(text) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
// Function to highlight text on the page
console.highlight = function (text, className = 'start') {
	// Clear any previous highlights
	clearHighlights();

	// Get the entire body text
	const treeElement = document.querySelector('.tree');

	// Create a regular expression to match the provided text
	const regex = new RegExp(escapeRegExp(text), 'gi');

	// Replace the matched text with a span to highlight it
	const highlightedText = treeElement.innerHTML.replace(regex, match => {
		return `<span class="highlight-${className}">${match}</span>`;
	});

	// Set the updated HTML back to the body
	treeElement.innerHTML = highlightedText;
};

// Function to clear previous highlights
function clearHighlights() {
	// Remove all previously highlighted spans
	document.querySelectorAll('.highlight').forEach(span => {
		span.outerHTML = span.innerHTML;
	});
}
