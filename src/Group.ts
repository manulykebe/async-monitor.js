import {watchAll} from './Watch';
import Tree from './Tree';
import now, {calcDuration} from './Now';
import WatchFunction, {WatchFunctionOptions, Metric} from './WatchFunction';
import Sequence from './Sequence';
// import {logger} from './Logger';
import {asyncMonitor} from './Index';
import Logger from './Logger';

const regexRepeat = (repeat: number): RegExp => {
	const length = repeat.toString().length;
	return new RegExp(`\\s{${length}}1\\/${repeat}\\s`);
};
interface GroupOptionsRepeat {
	repeat: number;
}
interface GroupOptions {
	repeat: number;
	runs: number;
}

export default class Group {
	logger: Logger;
	options: GroupOptions = {repeat: 0, runs: 0};
	get run(): number {
		return this.options.repeat >= 0 ? this.options.runs! : 0;
	}
	constructor(options: GroupOptionsRepeat = {repeat: 0}) {
		this.options = {...options, runs: 0};
		this.logger = new Logger();
		asyncMonitor.push(this);
	}
	set useLogger(value: boolean) {
		this.logger.useLogger = value;
	}
	get useLogger(): boolean {
		return this.logger.useLogger;
	}

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

	private _timeout: number = 0;
	get timeout(): number {
		return this._timeout;
	}
	set timeout(value: number) {
		this._timeout = value;
	}

	name?: string | undefined;

	private _onStartCallback?: () => void = () => {};
	get onStartCallback(): () => void {
		return () => {
			this.startTime = now();

			if (this.options.repeat > 0) {
				this.options.runs = 1;
			}

			if (this.useLogger) {
				this.logger.log(`*** START "${this.name ?? 'Group#' + this.id}" ***`);
			}
			this.logger.highlight('completed', {id: this._id}, 'start');
			this.logger.highlight(regexRepeat(this.options.repeat), {id: this._id}, ['start', 'repeat']);

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
			if (this.useLogger) {
				this.logger.log(`*** RUN "${this.run}" STARTED ***`);
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
			if (this.useLogger) {
				this.logger.log(`*** COMPLETED "${this.name ?? 'Group#' + this.id}" ***`);
			}
			this.logger.highlight('completed', {id: this._id}, 'complete');
			this.logger.highlight(' ' + this.options.repeat + '/' + this.options.repeat + ' ', {id: this._id}, ['complete']);
		};
	}
	set onCompleteCallback(value: () => void) {
		if (typeof value === 'function') this._onCompleteCallback = value.bind(this);
	}

	private _onCompleteRunCallback?: () => void = () => {};
	get onCompleteRunCallback(): () => void {
		return () => {
			if (this.useLogger) {
				this.logger.log(`*** RUN "${this.run}" COMPLETED ***`);
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

			if (this.useLogger) {
				this.logger.log(`*** REJECTED "${this.name ?? 'Group#' + this.id}" ***`);
				this.logger.log(this.metrics);
			}
			this.logger.highlight('completed', {id: this._id, index: this.sequence}, 'complete');
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

			if (this.useLogger) {
				this.logger.log(`*** REJECTED RUN "${this.run}" ***`);
				this.logger.log(this.metrics);
			}
			this.logger.highlight('completed', {id: this._id, index: this.sequence}, 'complete');
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
			if (this.useLogger) {
				this.logger.log(`*** ABORTED GROUP "${this.name ?? 'Group#' + this.id}" ***`);
			}
			this.logger.highlight('completed', {id: this._id}, 'aborted');
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

			if (this.useLogger) {
				this.logger.log(`*** ABORTED RUN "${this.run}" ***`);
			}
			this.logger.highlight('completed', {id: this._id}, 'aborted');
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
			if (this.useLogger) {
				this.logger.log(`*** ERROR in group "${this.name || this._id}" ***`);
			}
			this._onErrorCallback();
		};
	}
	set onErrorCallback(value: () => void) {
		if (typeof value === 'function') this._onErrorCallback = value;
	}

	// Add a watch function
	addWatch = (addWatchFunction: WatchFunctionOptions | Function) => {
		let watchFunction: WatchFunction;
		if (typeof addWatchFunction === 'function') {
			// Handle function
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
			// Handle object
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
			watchFunction.abort('manual aborted by user');
		} else {
			if (this.logger.useLogger) {
				this.logger.warn(`+++ No watch function found with name "${name}"`);
			}
		}
	}
	// Abort the entire group
	abort(reason: string = 'all functions aborted by user'): void {
		this._functions.forEach(fn => {
			fn.abort(reason);
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
		this.logger.displayRepeat(this._id, this.options.runs || 0, this.options.repeat);
		this.logger.clearHighlights(this._id);
	}

	removeAll(): void {
		this._functions = [];
	}

	add(): void {}
	remove(): void {}

	watchAll(): Promise<void> | void {
		if (this.logger.addToDocument()) this.logger.log(this.loggerTree, ['tree', `tree-${this.id}`]);

		if (this.timeout > 0) {
			setTimeout(() => {
				this.logger.warn('timeout on group');
				this.abort('timeout on group');
			}, this.timeout);
		}

		if (this.functions.length === 0) {
			if (this.logger.useLogger) {
				this.logger.warn('No watch functions found in this group.');
			}
			return new Promise<void>((resolve, reject) => {
				reject('No watch functions found in this group.');
			});
		}
		if (this.isProcessed) {
			if (this.logger.useLogger) {
				this.logger.warn('This watchAll group has already been processed.');
			}
			return new Promise<void>((resolve, reject) => {
				reject('This watchAll group has already been processed.');
			});
		}
		if (this.isRunning) {
			if (this.logger.useLogger) {
				this.logger.warn('This watchAll group is already being monitored.');
			}
			return new Promise<void>((resolve, reject) => {
				reject('This watchAll group is already being monitored.');
			});
		}

		this.startTime = now();
		if (typeof this.onStartCallback === 'function') this.onStartCallback();

		return watchAll(this);
	}

	get loggerTree(): string {
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
