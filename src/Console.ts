import version from './Version';

declare global {
	interface Console {
		highlight(text: string, _id: number, className?: string): void;
	}
}

function getCurrentTime() {
	const now = new Date();
	return now.toTimeString().split(' ')[0];
}

function createTableFromObject(data: Record<string, any> | Array<Record<string, any>>) {
	const table = document.createElement('table');
	table.classList.add('log-table');

	if (Array.isArray(data) && data.length > 0) {
		const headerRow = document.createElement('tr');
		const keys = Object.keys(data[0]);

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
			valueCell.textContent =
				typeof (data as Record<string, any>)[key] === 'object'
					? JSON.stringify((data as Record<string, any>)[key], undefined, 4)
					: (data as Record<string, any>)[key];
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

function appendLogToConsole(
	message: string | Record<string, any> | Array<Record<string, any>>,
	classnames: string | string[],
	_id?: number,
) {
	if (!message && message.trim() === '') return;
	const consoleDiv = document.getElementById('console');
	if (consoleDiv) {
		const logEntry = document.createElement('div');
		logEntry.classList.add('log-entry');

		const timeCol = document.createElement('div');
		timeCol.classList.add('log-time');
		timeCol.textContent = getCurrentTime();

		const messageCol = document.createElement('div');
		messageCol.classList.add('log-message');

		if (typeof message === 'object') {
			const table = createTableFromObject(message);
			messageCol.appendChild(table);
		} else {
			const pre = document.createElement('pre');
			if (!Array.isArray(classnames)) classnames = [classnames];
			if (!_id && typeof _id === 'number') {
				classnames.push(`log-group-${_id}`);
			}
			classnames.forEach(c => {
				if (typeof c === 'string' && c.trim() !== '') {
					pre.classList.add(c.trim());
				}
			});
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

	console.log(`async-monitor.js$${version}`);
};

console.log = function (message, classnames) {
	let _id;
	if (typeof classnames === 'number') {
		_id = classnames;
		classnames = undefined;
	}
	originalConsoleLog(message);
	appendLogToConsole(message, classnames, _id);
};

console.error = function (message, _id) {
	originalConsoleError(message);
	appendLogToConsole(message, 'log-error', _id);
};

console.group = function (label, _id) {
	originalConsoleGroup(label);
	appendLogToConsole(`${label}`, 'log-group', _id);
};

console.groupEnd = function () {
	originalConsoleGroupEnd();
};

console.table = function (data: Record<string, any> | Array<Record<string, any>>) {
	originalConsoleTable(data);
	appendLogToConsole(data, 'log-table');
};

console.warn = function (message, _id) {
	originalConsoleWarn(message);
	appendLogToConsole(message, 'log-warn', _id);
};
function escapeRegExp(text: string) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function findSpanElementWithClassAndText(text: string, _id: number, className: string = 'start') {
	const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
	if (!treeElement) return null;
	const spanElements = treeElement.querySelectorAll(`span.highlight-${className}`);

	for (let span of Array.from(spanElements)) {
		if (span.textContent === text) {
			return span;
		}
	}

	return null;
}
console.highlight = function (text: RegExp | string, _id: number, className: string | string[] = 'start') {
	const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
	if (!treeElement) {
		console.warn(`could not highlight tree-${_id}.`);
		return;
	}
	if (!Array.isArray(className)) className = [className];

	if (className.includes('start')) {
		let regex;
		if (typeof text === 'string') {
			regex = new RegExp(escapeRegExp(text), 'gi');
		} else {
			regex = new RegExp(text, 'g');
		}
		const highlightedText = treeElement.innerHTML.replace(regex, match => {
			return `<span class="highlight-${className.join(' highlight-')}">${match}</span>`;
		});

		treeElement.innerHTML = highlightedText;
	} else {
		if (typeof text === 'string') {
			const spanElement = findSpanElementWithClassAndText(text, _id, 'start');
			if (spanElement) {
				spanElement.classList.remove(`highlight-start`);
				spanElement.classList.add(`highlight-${className}`);
			}
		}
	}
};

export function clearHighlights(_id: number) {
	const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
	if (treeElement) {
		treeElement.querySelectorAll(`span`).forEach(span => {
			if (!span.classList.contains('highlight-repeat')) span.outerHTML = span.innerHTML;
		});
	}
}

export function displayRepeat(_id: number, runsNo: number, repeatNo: number) {
	const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
	if (treeElement) {
		const repeatElement = treeElement.querySelector(`span[class*="highlight-repeat"]`);
		if (repeatElement) {
			debugger;
			(repeatElement as HTMLElement).innerText =
				' '.repeat(1 + runsNo.toString().length - repeatNo.toString().length) + runsNo.toString().concat('/');
		}
	}
}
