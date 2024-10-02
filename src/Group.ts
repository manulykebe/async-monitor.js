import Element from './Element';
import {Watch, WatchAll} from './Watch';

export interface WatchFunction {
	child: string | undefined;
	group?: Group | undefined;
	parent: string | undefined;
	sequence: number | undefined;
	promise?: Promise<any> | void;
	f: () => void;
	onCompleteCallback: (() => void) | undefined;
	onRejectCallback: (() => void) | undefined;
	_isRunning?: boolean;
	_isFinished?: boolean;
	_index?: number | undefined;
}

let _group_id: number = 0;
export default class Group {
	private _id = _group_id++;
	_functions: WatchFunction[] = [];
	private _startTime: number = 0;
	private _stopTime: number = 0;
	_isFinished: boolean = false;
	private _seq: number = 0;

	__callback?: () => void | undefined;
	__callback_error?: () => void | undefined;

	// Default Callbacks
	_onStartCallback: () => void = () => {
		console.groupCollapsed('Group: ' + this._id);
		console.log('*** START ***');
	};

	_onCompleteCallback: () => void = () => {
		console.log('*** COMPLETE ***');
		console.groupEnd();
	};

	_onUnCompleteCallback: () => void = () => {
		console.log('*** UNCOMPLETE! ***');
		console.groupEnd();
	};

	_onRejectedCallback: () => void = () => {
		console.log('*** REJECTED ***');
		console.groupEnd();
	};

	_abort: AbortController = new AbortController(); // Declare abort controller

	// Check if any function in the group is running
	get _isRunning(): boolean {
		return !!this._functions.map(x => x._isRunning).reduce((a, b) => a || b, false);
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
		this._functions.forEach(x => (x._isFinished = false));
		this._isFinished = false;
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

	WatchAll(callback: () => void | undefined, callback_error: () => void | undefined) {
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
			console.warn('Groep wordt reeds uitgevoerd!');
			if (typeof this._onCompleteCallback === 'function') this._onCompleteCallback();
			return;
		}
		this._isFinished = false;

		if (typeof this._onStartCallback === 'function') this._onStartCallback();

		// Create an array of valid watch objects from the group's functions
		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined, // Use the promise if it exists, otherwise undefined
			onRejectCallback: fn.onRejectCallback, // The callback for rejection
			group: this, // The current group
		}));

		// Pass the array to the WatchAll function
		return WatchAll(this, undefined, callback, callback_error);
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
