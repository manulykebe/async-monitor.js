import Sequence from './Sequence';
import version from './Version';

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
				let jsonstring = '';
				try {
					jsonstring = JSON.stringify(item[key]);
				} catch (error) {
					jsonstring = `${key}: ${error}`;
				}
				td.textContent = typeof item[key] === 'object' ? jsonstring : item[key];
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
			let jsonstring = '';
			try {
				jsonstring = JSON.stringify((data as Record<string, any>)[key], undefined, 4);
			} catch (error) {
				jsonstring = `${key}: ${error}`;
			}
			valueCell.textContent =
				typeof (data as Record<string, any>)[key] === 'object' ? jsonstring : (data as Record<string, any>)[key];
			valueCell.classList.add('log-table-cell');

			row.appendChild(keyCell);
			row.appendChild(valueCell);
			table.appendChild(row);
		});
	}
	return table;
}

function escapeRegExp(text: string) {
	return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function findSpanElementWithClassAndText(text: string | RegExp, _id: number, className: string = 'start') {
	const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
	if (!treeElement) return null;
	const spanElements = treeElement.querySelectorAll(`span.highlight-${className}`);

	for (let span of Array.from(spanElements)) {
		if (typeof text === 'string' && span.textContent === text) {
			return span;
		} else if (text instanceof RegExp && span.textContent !== null && text.test(span.textContent)) {
			return span;
		}
	}

	return null;
}

function getCurrentTime() {
	const now = new Date();
	return now.toTimeString().split(' ')[0];
}

export default class Logger {
	public useLogger: boolean;
	public id: string;

	constructor(useLogger: boolean = false) {
		this.useLogger = useLogger;
		this.id = `logger-${Sequence.nextId()}`;
	}

	addToDocument(location: HTMLElement = document.body, divId: string = this.id): boolean {
		this.addCSSToDocument();
		const div = document.getElementById(divId);
		if (div) {
			div.innerHTML = '';
		} else {
			const loggerDiv = document.createElement('div');
			loggerDiv.id = divId;
			loggerDiv.classList.add(`logger`, `${this.id}`);
			location.appendChild(loggerDiv);
		}
		this.log(`async-monitor.js$${version}`, 'log-info');
		return true;
	}

	addCSSToDocument(cssHref: string = 'https://manulykebe.github.io/async-monitor.js/examples/styles.css') {
		const existingLink = document.querySelector(`link[href="${cssHref}"]`);

		if (!existingLink) {
			const link = document.createElement('link');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			link.href = cssHref;
			document.head.appendChild(link);
		}
	}

	appendLogTologger(
		message: string | Record<string, any> | Array<Record<string, any>>,
		classnames: string | string[],
		_id?: number,
	) {
		if (message === null) message = '<null>';
		if (message === undefined) message = '<undefined>';
		if (typeof message === 'string' && message.trim() === '') return;
		const loggerDiv = document.getElementById(this.id);
		if (loggerDiv) {
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

			loggerDiv.appendChild(logEntry);
		}
	}

	clear() {
		if (!this.useLogger) return;
		const loggerDiv = document.getElementById(this.id);
		if (loggerDiv) {
			loggerDiv.innerHTML = '';
		}
		this.log(`async-monitor.js$${version}`);
		this.log(`${this.id}`);
	}

	log(message: any, classnames?: string | string[]) {
		let _id;
		if (typeof classnames === 'number') {
			_id = classnames;
			classnames = undefined;
		}
		this.appendLogTologger(message, classnames || [], _id);
	}

	warn(message: any, _id?: number) {
		this.appendLogTologger(message, 'log-warn', _id);
	}

	error(message: any, _id?: number) {
		this.appendLogTologger(message, 'log-error', _id);
	}

	group(label: string, _id?: number) {
		this.appendLogTologger(`${label}`, 'log-group', _id);
	}

	table(data: Record<string, any> | Array<Record<string, any>>) {
		this.appendLogTologger(data, 'log-table');
	}

	highlight(text: RegExp | string, ids: {id: number; index?: number}, className: string | string[] = 'start') {
		const treeElement = document.querySelector(`pre[class*="tree-${ids.id}"]`);
		if (!treeElement) {
			this.warn(`could not highlight tree-${ids.id}.`);
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
				return `<span data-monitor-tree="${ids.id}" data-monitor-index="${ids.index}" class="highlight-${className.join(' highlight-')}"><i class="fas fa-stop icon" onclick="interact();"></i>${match}</span>`;
			});

			treeElement.innerHTML = highlightedText;
		} else {
			const spanElement = findSpanElementWithClassAndText(text, ids.id, 'start');
			if (spanElement) {
				spanElement.classList.remove(`highlight-start`);
				spanElement.classList.add(`highlight-${className}`);
			}
		}
	}

	clearHighlights(_id: number) {
		const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
		if (treeElement) {
			treeElement.querySelectorAll(`span`).forEach(span => {
				if (!(span.innerText === 'completed' || span.classList.contains('highlight-repeat')))
					span.outerHTML = span.innerHTML;
			});
		}
	}

	displayRepeat(_id: number, runsNo: number, repeatNo: number) {
		const treeElement = document.querySelector(`pre[class*="tree-${_id}"]`);
		if (treeElement) {
			const repeatElement = treeElement.querySelector(`span[class*="highlight-repeat"]`);
			if (repeatElement) {
				(repeatElement as HTMLElement).innerText =
					' '.repeat(1 - runsNo.toString().length + repeatNo.toString().length) +
					runsNo.toString().concat('/').concat(repeatNo.toString()).concat(' ');
			}
		}
	}
}
