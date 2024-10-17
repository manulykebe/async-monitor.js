import {Watch, WatchAll} from './Watch';
import Tree from './Tree';
import now, {calcDuration} from './Now';
import WatchFunction, {Metric} from './WatchFunction';
import Sequence from './Sequence';

export default class Group {
	useConsoleLog: boolean = true;

	private _id: number = Sequence.nextId();
	get id(): number {
		return this._id!;
	}
	private _functions: WatchFunction[] = [];
	get functions(): WatchFunction[] {
		return this._functions;
	}
	get isRunning(): boolean {
		return !!this._functions.map(x => x.isRunning).reduce((a, b) => a || b, false);
	}

	get isFinished(): boolean {
		return !!this._functions.map(x => x.isFinished).reduce((a, b) => a && b, true);
	}

	get isRejected(): boolean {
		return !!this._functions.map(x => x.isRejected).reduce((a, b) => a || b, false);
	}

	get isAborted(): boolean {
		return !!this._functions.map(x => x.isAborted).reduce((a, b) => a || b, false);
	}
	private _startTime: number = 0;
	get startTime(): number {
		return this._startTime;
	}
	set startTime(value: number) {
		this._startTime = value;
	}
	private _stopTime: number = 0;
	get stopTime(): number {
		return this._stopTime;
	}
	set stopTime(value: number) {
		this._stopTime = value;
	}
	private _duration: number = 0;
	get duration(): number {
		return Math.min(0, this._duration);
	}
	set duration(value: number) {
		this._duration = value;
	}
	name?: string | undefined;
	private _onStartCallback?: () => void = () => {};
	get onStartCallback(): () => void {
		return () => {
			this._startTime = now();
			console.log(`"${this.name ?? 'Group#' + this.id}" has started.`);

			if (this.useConsoleLog) {
				console.group('Group: ' + this._id, this._id);
				console.log(`*** START ${this._id} ***`);
				console.highlight('completed', this._id, 'start');
			}
			this._onStartCallback!();
		};
	}
	set onStartCallback(value: () => void) {
		if (typeof value === 'function') this._onStartCallback = value;
	}

	private _onCompleteCallback?: () => void = () => {};
	get onCompleteCallback(): () => void {
		return () => {
			this._stopTime = now();
			this._duration = calcDuration(this._startTime, this._stopTime);

			if (this.useConsoleLog) {
				console.log(`*** COMPLETE ${this._id} ***`);
				(console as any).highlight('completed', this._id, 'complete');
				console.groupEnd();
			}
			this._onCompleteCallback?.();
		};
	}
	set onCompleteCallback(value: () => void) {
		if (typeof value === 'function') this._onCompleteCallback = value;
	}

	private _onRejectCallback?: () => void = () => {};
	get onRejectCallback(): () => void {
		return () => {
			if (this.useConsoleLog) console.log(`*** REJECTED ${this._id} ***`);
			this._onRejectCallback?.();
		};
	}
	set onRejectCallback(value: () => void) {
		if (typeof value === 'function') this._onRejectCallback = value;
	}

	private _onAbortCallback?: () => void = () => {};
	get onAbortCallback(): () => void {
		return () => {
			if (this.useConsoleLog) console.log(`*** ABORTED ${this._id} ***`);
			this._onAbortCallback?.();
		};
	}
	set onAbortCallback(value: () => void) {
		if (typeof value === 'function') this._onAbortCallback = value;
	}

	sequence: number = 0;
	reset = () => {
		this._duration = 0;
		this._startTime = 0;
		this._stopTime = 0;
		this._functions.forEach(fn => fn.reset());
	};

	__callback?: () => void | undefined;
	__callback_error?: () => void | undefined;

	_onUnCompleteCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** ABORTED? ${this._id} ***`);
	};

	_onRejectedCallback: () => void = () => {
		if (this.useConsoleLog) console.log(`*** REJECTED? ${this._id} ***`);
	};

	// Add a watch function
	addWatch = (addWatchFunction: WatchFunction) => {
		let watchFunction: WatchFunction;
		if (typeof addWatchFunction === 'function') {
			watchFunction = new WatchFunction(addWatchFunction);
			if (this.sequence === 0) {
				watchFunction.parent = watchFunction.parent || '';
				watchFunction.child = '_monitor_1';
				this.sequence = 1;
			} else {
				watchFunction.parent = '_monitor_' + this.sequence++;
				watchFunction.child = '_monitor_' + this.sequence;
			}
		} else {
			// Create a new WatchFunction and add it to the group
			watchFunction = new WatchFunction(addWatchFunction);
		}
		// Assign an AbortController to the watch function
		watchFunction.group = this;
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

	Watch(onStartCallback: () => void, onRejectCallback: () => void) {
		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined,
			onRejectCallback: fn.onRejectCallback,
			group: this,
		}));

		return new Watch(watchArray, onStartCallback, onRejectCallback);
	}

	WatchAll(
		onStartCallback?: () => void,
		onCompleteCallback?: () => void,
		onRejectCallback?: () => void,
		onAbortCallback?: () => void,
	) {
		if (onStartCallback) {
			this.onStartCallback = onStartCallback;
		}
		if (onCompleteCallback) {
			this.onCompleteCallback = onCompleteCallback;
		}
		if (onRejectCallback) {
			this.onRejectCallback = onRejectCallback;
		}
		if (onAbortCallback) {
			this.onAbortCallback = onAbortCallback;
		}

		if (this.isRunning) {
			console.warn('This WatchAll group is already being monitored.');
			return;
		}
		this.onStartCallback();

		this._startTime = now();
		if (typeof this._onStartCallback === 'function') this._onStartCallback();

		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined,
			onRejectCallback: fn.onRejectCallback,
			group: this,
			_startTime: now(),
		}));

		return WatchAll(this); //, onStartCallback, onRejectCallback);
	}

	get consoleTree(): string {
		const treeData = this._functions.map(f => {
			return {name: f.name, parent: f.parent, child: f.child};
		});

		const treeBuilder = new Tree();
		return treeBuilder.processTree(treeData);
	}

	get metrics(): Metric[] {
		return this._functions.map(f => {
			return f.metrics;
		});
	}

	onRejected(cbf: () => void) {
		this._onRejectedCallback = cbf;
		return this;
	}
	onStart(cbf: () => void) {
		this._onStartCallback = cbf;
		return this;
	}
	onComplete(cbf: () => void) {
		this._onCompleteCallback = cbf;
		return this;
	}
}
