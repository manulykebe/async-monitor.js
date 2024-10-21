import Element from './Element';
import {Watch, WatchAll} from './Watch';
import Tree from './Tree';
import now from './Now';
import {clearHighlights, displayRepeat} from './Console';

interface CustomDocument extends Document {
	['async-monitor-groups']: Group[];
}
declare let document: CustomDocument;

document['async-monitor-groups'] = [];

type Metric = {
	index: number;
	name: string;
	start: number | undefined;
	duration: number | undefined;
	f: string;
	isRunning: boolean;
	isFinished: boolean;
	sequence: number;
};

const regexRepeat = (repeat: number): RegExp => {
	const l = repeat.toString().length;
	// regex that matches "(l)spaces" "1/" "l numbers" "1 space"
	return new RegExp(`\\s{${l}}1\\/${repeat}\\s`);
};

export interface WatchFunction {
	name: string;
	parent?: string | undefined;
	child?: string | undefined;
	group?: Group | undefined;
	sequence?: number | undefined;
	promise?: Promise<any> | void;
	f: () => Promise<any> | void;
	onStartCallback?: (() => void) | undefined;
	onCompleteCallback?: (() => void) | undefined;
	onRejectCallback?: (() => void) | undefined;
	_isRunning?: boolean;
	_isFinished?: boolean;
	_isRejected?: boolean;
	_index?: number | undefined;
	_startTime: number;
	_stopTime: number;
	_duration: number;
}

interface GroupOptions {
	repeat: number;
	runs?: number;
}

let _group_id: number = 0;
export default class Group {
	options: GroupOptions = {repeat: 0, runs: 0};
	constructor(options: GroupOptions = {repeat: 0, runs: 1}) {
		this.options = options;
		document['async-monitor-groups'].push(this);
	}
	useConsoleLog: boolean = true;
	_id = _group_id++;
	_functions: WatchFunction[] = [];
	_startTime: number = 0;
	_stopTime: number = 0;
	_duration: number = 0;
	_seq: number = 0;

	__callback?: () => void | undefined;
	__callback_error?: () => void | undefined;

	// Default Callbacks
	_onStartCallback: () => void = () => {
		console.group('Group: ' + this._id, this._id);
		if (this.useConsoleLog) {
			console.log(`*** START ${this._id} ***`);
			(console as any).highlight('completed', {id: this._id}, 'start');
			(console as any).highlight(regexRepeat(this.options.repeat), {id: this._id}, ['start', 'repeat']);
		}
	};

	_onCompleteCallback: () => void = () => {
		this.options.runs = (this.options.runs ?? 1) + 1;
		if (this.options.runs <= this.options.repeat || this.options.repeat === -1) {
			this.reset(false);
			this.WatchAll(this.__callback, this.__callback_error);
			return;
		} else {
			if (this.useConsoleLog) {
				(console as any).highlight(' ' + this.options.repeat + '/' + this.options.repeat + ' ', {id: this._id}, [
					'complete',
				]);
			}
		}

		if (this.useConsoleLog) {
			console.log(`*** COMPLETE ${this._id} ***`);
			(console as any).highlight('completed', {id: this._id}, 'complete');
			console.groupEnd();
		}
	};

	_onUnCompleteCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** ABORTED? ${this._id} ***`);
	};

	_onRejectedCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** REJECTED? ${this._id} ***`);
	};

	_abort: AbortController = new AbortController(); // Declare abort controller

	get _isRunning(): boolean {
		return !!this._functions.map(x => x._isRunning).reduce((a, b) => a || b, false);
	}

	get _isFinished(): boolean {
		return !!this._functions.map(x => x._isFinished).reduce((a, b) => a && b, true);
	}

	get _isRejected(): boolean {
		return !!this._functions.map(x => x._isRejected).reduce((a, b) => a || b, true);
	}

	// Add a watch function
	addWatch = (addWatchFunction: WatchFunction | (() => void)) => {
		let watchFunction: WatchFunction;
		if (typeof addWatchFunction === 'function') {
			watchFunction = new Element(addWatchFunction);
			if (this._seq === 0) {
				watchFunction.parent = watchFunction.parent || undefined;
				watchFunction.child = '_monitor_1';
				this._seq = 1;
			} else {
				watchFunction.parent = '_monitor_' + this._seq++;
				watchFunction.child = '_monitor_' + this._seq;
			}
		} else {
			// Create a new Element and add it to the group
			watchFunction = new Element(addWatchFunction);
		}
		watchFunction.group = this;
		this._functions.push(watchFunction);
	};
	// Abort the group TODO
	abort(): void {
		this._abort.abort();
	}
	// Reset all watch functions in the group
	reset(resetRuns: boolean = true): void {
		this._functions.forEach(fn => {
			fn._isRunning = false;
			fn._isFinished = false;
			fn._isRejected = false;
		});
		if (resetRuns) {
			this.options.runs = 1;
		}
		displayRepeat(this._id, this.options.runs ?? 1, this.options.repeat ?? 1);
		clearHighlights(this._id);
	}

	// Get all functions in the group
	getAll(): Array<WatchFunction> {
		return this._functions;
	}

	// Remove all functions from the group
	removeAll(): void {
		this._functions = [];
	}

	// Add and remove placeholders
	add(): void {}
	remove(): void {}

	Watch(callback: () => void, callback_error: () => void) {
		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined, // Use the promise if it exists, otherwise undefined
			onRejectCallback: fn.onRejectCallback, // The callback if the function fails
			group: this, // The current group
		}));

		return new Watch(watchArray, callback, callback_error);
	}

	WatchAll(callback?: () => void | undefined, callback_error?: () => void | undefined) {
		this.__callback = callback ?? (() => {});
		this.__callback_error = callback_error ?? (() => {});

		callback = this.__callback;
		callback_error = this.__callback_error;

		if (this._isRunning) {
			console.warn('This WatchAll group is already being monitored.');
			return;
		}

		this._startTime = now();
		if (typeof this._onStartCallback === 'function') this._onStartCallback();

		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined, // Use the promise if it exists, otherwise undefined
			onRejectCallback: fn.onRejectCallback, // The callback for rejection
			group: this, // The current group,
			_startTime: now(),
		}));

		// Pass the array to the WatchAll function
		return WatchAll(this, callback, callback_error);
	}

	get consoleTree(): string {
		const treeData = this._functions.map(f => {
			return {name: f.name, parent: f.parent, child: f.child};
		});

		const treeBuilder = new Tree({repeat: this.options.repeat});
		return treeBuilder.processTree(treeData);
	}

	get metrics(): Metric[] {
		return [
			...this._functions.map((f, i) => {
				return {
					index: i,
					name: f.name,
					sequence: f.sequence ?? 0,
					start: f.group ? f._startTime - f.group._startTime : undefined,
					duration: f._duration,
					f: f.f.toString(),
					isRunning: f._isRunning ?? false,
					isFinished: f._isFinished ?? false,
					isRejected: f._isRejected ?? false,
				};
			}),
			{
				index: 0,
				name: '',
				sequence: 0,
				start: 0,
				duration: this._duration,
				f: '',
				isRunning: this._isRunning ?? false,
				isFinished: this._isFinished ?? false,
				isRejected: this._isRejected ?? false,
			},
		];
	}

	onRejected(callback: () => void) {
		this._onRejectedCallback = callback;
		return this;
	}
	onStart(callback: () => void) {
		this._onStartCallback = callback;
		return this;
	}
	onComplete(callback: () => void) {
		this._onCompleteCallback = callback;
		return this;
	}
}
