import {watchAll} from './Watch';
import Tree from './Tree';
import now, {calcDuration} from './Now';
import WatchFunction, {Metric} from './WatchFunction';
import Sequence from './Sequence';
import {clearHighlights, displayRepeat} from './Console';

const regexRepeat = (repeat: number): RegExp => {
	const length = repeat.toString().length;
	return new RegExp(`\\s{${length}}1\\/${repeat}\\s`);
};

interface GroupOptions {
	repeat: number;
	runs: number;
}

export default class Group {
	options: GroupOptions = {repeat: 0, runs: 0};
	get run(): number {
		return this.options.repeat >= 0 ? (this.options.runs ?? 0) : 0;
	}
	constructor(options: GroupOptions = {repeat: 0, runs: 0}) {
		this.options = options;
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
		return this._functions.some(fn => fn.isRunning);
	}

	get isFinished(): boolean {
		return this._functions.every(fn => fn.isFinished);
	}

	get isRejected(): boolean {
		return this._functions.some(fn => fn.isRejected);
	}

	get isAborted(): boolean {
		return this._functions.some(fn => fn.isAborted);
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
		this._duration = calcDuration(this._startTime, this._stopTime);
	}
	private _duration: number = 0;
	get duration(): number {
		return Math.min(0, this._duration);
	}

	name?: string | undefined;

	private _onStartCallback?: () => void = () => {};
	get onStartCallback(): () => void {
		return () => {
			this.startTime = now();

			if (this.options.repeat > 0) {
				this.options.runs = 1;
			}

			if (this.useConsoleLog) {
				console.log(`*** START "${this.name ?? 'Group#' + this.id}" ***`);
				console.highlight('completed', {id: this._id}, 'start');
				console.highlight(regexRepeat(this.options.repeat), {id: this._id}, ['start', 'repeat']);
			}

			this._onStartCallback!();
		};
	}
	set onStartCallback(value: () => void) {
		if (typeof value === 'function') this._onStartCallback = value.bind(this);
	}

	private _onStartRunCallback?: () => void = () => {};
	get onStartRunCallback(): () => void {
		return () => {
			if (this.isRunning) return;
			if (this.useConsoleLog) {
				console.log(`*** RUN "${this.run}" STARTED ***`);
			}
			this._onStartRunCallback!();
		};
	}
	set onStartRunCallback(value: () => void) {
		if (typeof value === 'function') this._onStartRunCallback = value.bind(this);
	}

	private _onCompleteCallback?: () => void = () => {};
	get onCompleteCallback(): () => void {
		return () => {
			this._onCompleteCallback!();

			this.stopTime = now();
			if (this.useConsoleLog) {
				console.log(`*** COMPLETED "${this.name ?? 'Group#' + this.id}" ***`);
				console.highlight('completed', {id: this._id}, 'complete');
				console.highlight(' ' + this.options.repeat + '/' + this.options.repeat + ' ', {id: this._id}, ['complete']);
				console.groupEnd();
			}
		};
	}
	set onCompleteCallback(value: () => void) {
		if (typeof value === 'function') this._onCompleteCallback = value.bind(this);
	}

	private _onCompleteRunCallback?: () => void = () => {};
	get onCompleteRunCallback(): () => void {
		return () => {
			if (this.useConsoleLog) {
				console.log(`*** RUN "${this.run}" COMPLETED ***`);
			}
			this._onCompleteRunCallback!();
		};
	}
	set onCompleteRunCallback(value: () => void) {
		if (typeof value === 'function') this._onCompleteRunCallback = value.bind(this);
	}

	private _onRejectCallback?: () => void = () => {};
	get onRejectCallback(): () => void {
		return () => {
			this.stopTime = now();

			if (this.useConsoleLog) {
				console.log(`*** REJECTED "${this.name ?? 'Group#' + this.id}" ***`);
				console.highlight('completed', {id: this._id, index: this.sequence}, 'complete');
				console.groupEnd();
				console.log(this.metrics);
			}
			this._onRejectCallback?.();
		};
	}
	set onRejectCallback(value: () => void) {
		if (typeof value === 'function') this._onRejectCallback = value.bind(this);
	}

	private _onRejectRunCallback?: () => void = () => {};
	get onRejectRunCallback(): () => void {
		return () => {
			this.stopTime = now();

			if (this.useConsoleLog) {
				console.log(`*** REJECTED RUN "${this.run}" ***`);
				console.highlight('completed', {id: this._id, index: this.sequence}, 'complete');
				console.groupEnd();
				console.log(this.metrics);
			}
			this._onRejectRunCallback?.();
		};
	}
	set onRejectRunCallback(value: () => void) {
		if (typeof value === 'function') this._onRejectRunCallback = value.bind(this);
	}

	private _onAbortCallback?: () => void = () => {};
	get onAbortCallback(): () => void {
		return () => {
			this.stopTime = now();

			if (this.isAborted) return;
			if (this.useConsoleLog) {
				console.log(`*** ABORTED GROUP "${this.name ?? 'Group#' + this.id}" ***`);
				console.highlight('completed', {id: this._id}, 'aborted');
				console.groupEnd();
			}
			if (typeof this._onAbortCallback === 'function') {
				this._onAbortCallback();
			}
		};
	}
	set onAbortCallback(value: () => void) {
		if (typeof value === 'function') this._onAbortCallback = value.bind(this);
	}

	private _onAbortRunCallback?: () => void = () => {};
	get onAbortRunCallback(): () => void {
		return () => {
			this.stopTime = now();

			if (this.useConsoleLog) {
				console.log(`*** ABORTED RUN "${this.run}" ***`);
				console.highlight('completed', {id: this._id}, 'aborted');
				console.groupEnd();
			}
			this._onAbortRunCallback?.();
		};
	}
	set onAbortRunCallback(value: () => void) {
		if (typeof value === 'function') this._onAbortRunCallback = value.bind(this);
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
	addWatch = (addWatchFunction: WatchFunction | Function) => {
		let watchFunction: WatchFunction;
		if (typeof addWatchFunction === 'function') {
			// Convert a regular function to a new (async) WatchFunction and add it to the group
			watchFunction = new WatchFunction({
				f: addWatchFunction as () => void | Promise<any>,
				name: `watch-function-${this.sequence + 1}`,
				parent: this.sequence === 0 ? undefined : `_monitor_${this.sequence}`,
				child: `_monitor_${this.sequence + 1}`,
				onStartCallback: () => {},
				onCompleteCallback: () => {},
				onRejectCallback: () => {},
				onAbortCallback: () => {},
			});
			this.sequence++;
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
		this.startTime = 0;
		this.stopTime = 0;
		this._functions.forEach(fn => fn.reset());
		if (resetRuns) {
			this.options.runs = 1;
		}
		displayRepeat(this._id, this.options.runs, this.options.repeat);
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

	watchAll(): Promise<void> | void {
		if (this.functions.length === 0) {
			console.warn('No watch functions found in this group.');
			return new Promise<void>((resolve, reject) => {
				reject('No watch functions found in this group.');
			});
		}
		if (this.isProcessed) {
			console.warn('This watchAll group has already been processed.');
			return new Promise<void>((resolve, reject) => {
				reject('This watchAll group has already been processed.');
			});
		}
		if (this.isRunning) {
			console.warn('This watchAll group is already being monitored.');
			return new Promise<void>((resolve, reject) => {
				reject('This watchAll group is already being monitored.');
			});
		}

		this.startTime = now();
		if (typeof this.onStartCallback === 'function') this.onStartCallback();

		return watchAll(this);
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
}
