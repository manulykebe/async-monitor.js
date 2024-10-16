import {Watch, WatchAll} from './Watch';
import Tree from './Tree';
import now from './Now';
import WatchFunction, {Metric} from './WatchFunction';

let _group_id: number = 0;
export default class Group {
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
			(console as any).highlight('completed', this._id, 'start');
		}
	};

	_onCompleteCallback: () => void = () => {
		if (this.useConsoleLog) {
			console.log(`*** COMPLETE ${this._id} ***`);
			(console as any).highlight('completed', this._id, 'complete');
			console.groupEnd();
		}
	};

	_onUnCompleteCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** ABORTED? ${this._id} ***`);
	};

	_onRejectedCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** REJECTED? ${this._id} ***`);
	};

	get _isRunning(): boolean {
		return !!this._functions.map(x => x.isRunning).reduce((a, b) => a || b, false);
	}

	get _isFinished(): boolean {
		return !!this._functions.map(x => x.isFinished).reduce((a, b) => a && b, true);
	}

	get _isRejected(): boolean {
		return !!this._functions.map(x => x.isRejected).reduce((a, b) => a || b, false);
	}

	get _isAborted(): boolean {
		return !!this._functions.map(x => x.isAborted).reduce((a, b) => a || b, false);
	}
	// Add a watch function
	addWatch = (addWatchFunction: WatchFunction) => {
		let watchFunction: WatchFunction;
		if (typeof addWatchFunction === 'function') {
			watchFunction = new WatchFunction(addWatchFunction);
			if (this._seq === 0) {
				watchFunction.parent = watchFunction.parent || '';
				watchFunction.child = '_monitor_1';
				this._seq = 1;
			} else {
				watchFunction.parent = '_monitor_' + this._seq++;
				watchFunction.child = '_monitor_' + this._seq;
			}
		} else {
			// Create a new WatchFunction and add it to the group
			watchFunction = new WatchFunction(addWatchFunction);
		}
		// Assign an AbortController to the watch function
		watchFunction.group = this;
		// Wrap the function with the abort signal
		// const originalFunction = watchFunction.f;
		// watchFunction.f = () => {
		// 	return new Promise((resolve, reject) => {
		// 		const signal = watchFunction.signal;
		// 		// If the signal is aborted before execution
		// 		signal.addEventListener('abort', () => {
		// 			watchFunction.onAbortCallback && watchFunction.onAbortCallback();
		// 		});
		// 		// Execute the original function and resolve/reject accordingly
		// 		const result = originalFunction();
		// 		if (result instanceof Promise) {
		// 			result.then(resolve).catch(reject);
		// 		} else {
		// 			resolve(result);
		// 		}
		// 	});
		// };
		this._functions.push(watchFunction);
	};
	// Abort a specific watch function by name
	abortWatch(name: string): void {
		const watchFunction = this._functions.find(fn => fn.name === name);
		if (watchFunction) {
			watchFunction.abort();
		} else {
			console.warn(`+++ No watch function found with name "${name}"`);
		}
	}
	// Abort the entire group
	abort(): void {
		this._functions.forEach(fn => {
			fn.abort();
		});
	}
	// Reset all watch functions in the group
	reset(): void {
		this._duration = 0;
		this._startTime = 0;
		this._stopTime = 0;
		this._functions.forEach(fn => fn.reset());
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
			promise: fn.promise ?? undefined,
			onRejectCallback: fn.onRejectCallback,
			group: this,
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
			promise: fn.promise ?? undefined,
			onRejectCallback: fn.onRejectCallback,
			group: this,
			_startTime: now(),
		}));

		return WatchAll(this, callback, callback_error);
	}

	get consoleTree(): string {
		const treeData = this._functions.map(f => {
			return {name: f.name, parent: f.parent, child: f.child};
		});

		const treeBuilder = new Tree();
		return treeBuilder.processTree(treeData);
	}

	get metrics(): Metric[] {
		return [
			...this._functions.map((f, i) => {
				return {
					...f.metrics,
				};
			}),
			...this.metrics,
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
