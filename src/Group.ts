import {Watch, WatchAll} from './Watch';
import Tree from './Tree';
import now, {calcDuration} from './Now';
import WatchFunction, {Metric} from './WatchFunction';
import Sequence from './Sequence';
import {clearHighlights, displayRepeat} from './Console';
interface CustomDocument extends Document {
	['async-monitor-groups']: Group[];
}
declare let document: CustomDocument;
document['async-monitor-groups'] = [];

const regexRepeat = (repeat: number): RegExp => {
	const l = repeat.toString().length;
	// regex that matches "(l)spaces" "1/" "l numbers" "1 space"
	return new RegExp(`\\s{${l}}1\\/${repeat}\\s`);
};

interface GroupOptions {
	repeat: number;
	runs?: number;
}

export default class Group {
	options: GroupOptions = {repeat: 0, runs: 0};
	constructor(options: GroupOptions = {repeat: 0, runs: 1}) {
		this.options = options;
		document['async-monitor-groups'].push(this);
	}
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
	get isProcessed(): boolean {
		return this.isFinished || this.isRejected || this.isAborted;
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
			if (this.isProcessed) {
				return;
			}
			this._startTime = now();
			if (this.useConsoleLog) {
				console.log(`"${this.name ?? 'Group#' + this.id}" has started.`);
				console.log(`*** START ${this._id} ***`);
				console.highlight('completed', {id: this._id}, 'start');
				console.highlight(regexRepeat(this.options.repeat), {id: this._id}, ['start', 'repeat']);
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
			this.options.runs = (this.options.runs ?? 1) + 1;
			if (this.options.runs <= this.options.repeat || this.options.repeat === -1) {
				this.reset(false);
				this.WatchAll();
				return;
			} else {
				if (this.useConsoleLog) {
					console.highlight(' ' + this.options.repeat + '/' + this.options.repeat + ' ', {id: this._id}, ['complete']);
				}
			}

			this._stopTime = now();
			this._duration = calcDuration(this._startTime, this._stopTime);

			if (this.useConsoleLog) {
				console.log(`*** COMPLETE ${this._id} ***`);
				console.highlight('completed', {id: this._id}, 'complete');
				console.groupEnd();
				console.log(this.metrics);
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
			this._stopTime = now();
			this._duration = calcDuration(this._startTime, this._stopTime);

			if (this.useConsoleLog) {
				console.log(`*** REJECTED ${this._id} ***`);
				console.highlight('completed', {id: this._id, index: this.sequence}, 'complete');
				console.groupEnd();
				console.log(this.metrics);
			}
			this._onRejectCallback?.();
		};
	}
	set onRejectCallback(value: () => void) {
		if (typeof value === 'function') this._onRejectCallback = value;
	}

	private _onAbortCallback?: () => void = () => {};
	get onAbortCallback(): () => void {
		return () => {
			this._stopTime = now();
			this._duration = calcDuration(this._startTime, this._stopTime);

			if (this.useConsoleLog) {
				console.log(`*** ABORTED ${this._id} ***`);
				console.highlight('completed', {id: this._id}, 'aborted');
				console.groupEnd();
			}
			this._onAbortCallback?.();
		};
	}
	set onAbortCallback(value: () => void) {
		if (typeof value === 'function') this._onAbortCallback = value;
	}

	sequence: number = 0; //??

	private _onErrorCallback: () => void = () => {};
	get onErrorCallback(): () => void {
		return () => {
			if (this.useConsoleLog) console.log(`*** ERROR in group "${this.name || this._id}" ***`);

			this._onErrorCallback();
		};
	}
	set onErrorCallback(value: () => void) {
		if (typeof value === 'function') this._onErrorCallback = value;
	}

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

	// Reset all watch functions in the group
	reset(resetRuns: boolean = true): void {
		this._duration = 0;
		this._startTime = 0;
		this._stopTime = 0;
		this._functions.forEach(fn => fn.reset());
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

	Watch(onStartCallback: () => void, onRejectCallback: () => void) {
		const watchArray = this._functions.map(fn => ({
			promise: fn.promise ?? undefined,
			onRejectCallback: fn.onRejectCallback,
			group: this,
		}));

		return new Watch(watchArray, onStartCallback, onRejectCallback);
	}

	WatchAll(
		onStartCallback?:
			| (() => void)
			| {
					onStartCallback?: () => void;
					onCompleteCallback?: () => void;
					onRejectCallback?: () => void;
					onAbortCallback?: () => void;
			  },
		onCompleteCallback?: () => void,
		onRejectCallback?: () => void,
		onAbortCallback?: () => void,
	) {
		if (typeof onStartCallback === 'object') {
			const {onStartCallback: startCb, onCompleteCallback, onRejectCallback, onAbortCallback} = onStartCallback;
			if (startCb) {
				this.onStartCallback = startCb;
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
		} else {
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
		}

		if (this.isRunning) {
			console.warn('This WatchAll group is already being monitored.');
			return;
		}

		this._startTime = now();
		if (typeof this.onStartCallback === 'function') this.onStartCallback();

		// const watchArray = this._functions.map(fn => ({
		// 	promise: fn.promise ?? undefined,
		// 	onRejectCallback: fn.onRejectCallback,
		// 	group: this,
		// 	_startTime: now(),
		// }));

		return WatchAll(this); //, onStartCallback, onRejectCallback);
	}

	get consoleTree(): string {
		const treeData = this._functions.map(f => {
			return {name: f.name, parent: f.parent, child: f.child};
		});

		const treeBuilder = new Tree({repeat: this.options.repeat});
		return treeBuilder.processTree(treeData);
	}

	get metrics(): Metric[] {
		return this._functions.map(f => {
			return f.metrics;
		});
	}

	onRejected(cbf: () => void) {
		this.onRejectCallback = cbf;
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
