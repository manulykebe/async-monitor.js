import Element from './Element';
import {Watch, WatchAll} from './Watch';

export interface WatchFunction {
	name: string;
	parent?: string | undefined;
	child?: string | undefined;
	group?: Group | undefined;
	sequence?: number | undefined;
	promise?: Promise<any> | void;
	f: () => void;
	onStartCallback?: (() => void) | undefined;
	onCompleteCallback?: (() => void) | undefined;
	onRejectCallback?: (() => void) | undefined;
	_isRunning?: boolean;
	_isFinished?: boolean;
	_index?: number | undefined;
	_startTime: number;
	_stopTime: number;
	_duration: number;
}

let _group_id: number = 0;
export default class Group {
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
		console.group('Group: ' + this._id);
		console.log('*** START ***');
	};

	_onCompleteCallback: () => void = () => {
		console.log('*** COMPLETE ***');
		console.groupEnd();
	};

	_onUnCompleteCallback: () => void = () => {
		console.log('*** UNCOMPLETE! ***');
	};

	_onRejectedCallback: () => void = () => {
		console.log('*** REJECTED ***');
	};

	_abort: AbortController = new AbortController(); // Declare abort controller

	// Check if any function in the group is running
	get _isRunning(): boolean {
		return !!this._functions.map(x => x._isRunning).reduce((a, b) => a || b, false);
	}

	// Check if any function in the group is running
	get _isFinished(): boolean {
		return !!this._functions.map(x => x._isFinished).reduce((a, b) => a && b, true);
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
	reset(): void {
		this._functions.forEach(x => (x._isRunning = false));
		this._functions.forEach(x => (x._isFinished = false));
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

		if (callback !== undefined) {
			this.__callback = callback;
		} else {
			callback = this.__callback;
		}
		if (callback_error !== undefined) {
			this.__callback_error = callback_error;
		} else {
			callback_error = this.__callback_error;
		}

		if (this._isRunning) {
			console.warn('This WatchAll group is already being monitored.');
			if (typeof this._onCompleteCallback === 'function') this._onCompleteCallback();
			return;
		}

		this._startTime = Date.now();
		if (typeof this._onStartCallback === 'function') this._onStartCallback();

		// Create an array of valid watch objects from the group's functions
		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined, // Use the promise if it exists, otherwise undefined
			onRejectCallback: fn.onRejectCallback, // The callback for rejection
			group: this, // The current group,
			_startTime: Date.now(),
		}));

		// Pass the array to the WatchAll function
		return WatchAll(this, callback, callback_error);
	}

	onRejected(callback: () => void) {
		this._onRejectedCallback = callback;
		return this;
	}
	onStart(callback: () => void) {
		this._startTime = Date.now(); //#m
		this._onStartCallback = callback;
		return this;
	}
	onComplete(callback: () => void) {
		debugger;
		this._stopTime = Date.now(); //#m
		this._onCompleteCallback = callback;
		return this;
	}
}
