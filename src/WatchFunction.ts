import Group from './Group';
import now, {calcDuration} from './Now';
import Sequence from './Sequence';
import Logger from './Logger';

export type Metric = {
	id: number;
	name: string;
	start: number | undefined;
	duration: number | undefined;
	isRunning: boolean;
	isFinished: boolean;
	isRejected: boolean;
	isAborted: boolean;
	sequence: number;
	status: string;
	reason: any;
	value: any;
};

export interface WatchFunctionOptions {
	f: () => Promise<any> | void;
	name?: string | undefined;
	parent?: string | undefined;
	child?: string | undefined;
	onStartCallback?: () => void;
	onCompleteCallback?: () => void;
	onRejectCallback?: () => void;
	onAbortCallback?: () => void;
}

export default class WatchFunction {
	private _id: number = Sequence.nextId();
	get id(): number {
		return this._id!;
	}
	private _isAborted: boolean = false;
	get isAborted(): boolean {
		return this._isAborted;
	}
	private _isFinished: boolean = false;
	get isFinished(): boolean {
		return this._isFinished;
	}
	private _isRejected: boolean = false;
	get isRejected(): boolean {
		return this._isRejected;
	}
	private _isRunning: boolean = false;
	get isRunning(): boolean {
		return this._isRunning;
	}

	get isProcessed(): boolean {
		return this._isFinished || this._isRejected || this._isAborted;
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

	private _timeout: number = 0; //ms
	get timeout(): number {
		return this._timeout;
	}
	set timeout(value: number) {
		this._timeout = value;
	}

	private abortController: AbortController = new AbortController();
	abort = (reason?: string) => this.abortController.abort(reason || 'manually aborted');
	signal: AbortSignal = this.abortController.signal;

	name?: string | undefined;
	parent?: string | undefined; // undefined means it's a root function
	child?: string | undefined;
	group?: Group | undefined;
	f: () => Promise<any>;
	onStartCallback?: () => void;
	onCompleteCallback?: () => void;
	onRejectCallback?: () => void;
	onAbortCallback?: () => void;

	sequence: number = 0;
	reset = () => {
		this._isAborted = false;
		this._isFinished = false;
		this._isRejected = false;
		this._isRunning = false;
		this._startTime = 0;
		this._stopTime = 0;
		this._duration = 0;
		this.sequence = 0;
		this.abortController = new AbortController();
		this.signal = this.abortController.signal;
		this.abort = (reason?: string) => this.abortController.abort(reason || 'manually aborted');
	};

	'promise': Promise<any>;

	'promiseStatus': {status: string; reason: any; value: any} = {
		status: 'not started',
		reason: undefined,
		value: undefined,
	};
	get metrics(): Metric {
		return {
			id: this._id!,
			name: this.name || '',
			start: Math.max(0, this.group ? this._startTime - this.group.startTime : 0),
			duration: this._duration,
			status: this.promiseStatus.status,
			value: this.promiseStatus.value,
			reason: this.promiseStatus.reason,
			isRunning: this._isRunning,
			isFinished: this._isFinished,
			isRejected: this._isRejected,
			isAborted: this._isAborted,
			sequence: this.sequence,
		};
	}

	constructor(
		arg: WatchFunctionOptions | (() => Promise<any> | void) | (() => {}),
		name?: string | undefined,
		parent?: string | undefined,
		child?: string | undefined,
		onStartCallback?: () => void,
		onCompleteCallback?: () => void,
		onRejectCallback?: () => void,
		onAbortCallback?: () => void,
		onErrorCallback?: () => void,
	) {
		const logger = this.group?.logger || new Logger();

		if (typeof arg === 'object') {
			this.f = () => {
				const result = arg.f();
				return result instanceof Promise ? result : Promise.resolve(result);
			};
			this.name = arg.name;
			this.parent = arg.parent;
			this.child = arg.child;
			this.onStartCallback = function () {
				this._isRunning = true;
				this._startTime = now();
				if (logger.useLogger) logger.log(`──"${this.name}" has started.`);
				if (arg.onStartCallback) arg.onStartCallback!();
			};

			this.onCompleteCallback = function () {
				this._isFinished = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				if (logger.useLogger) logger.log(`──"${this.name}" has completed.`);
				if (arg.onCompleteCallback) arg.onCompleteCallback!();
			};

			this.onRejectCallback = function () {
				if (this._isAborted) {
					return;
				}
				this._isRejected = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				if (logger.useLogger) logger.warn(`──"${this.name}" was rejected.`);
				if (arg.onRejectCallback) arg.onRejectCallback!();
			};
			this.onAbortCallback = function () {
				if (this._isFinished) return;

				if (!this._isAborted) {
					arg.onAbortCallback && arg.onAbortCallback();
					this.group!.onAbortCallback && this.group!.onAbortCallback();
				}
				this._isAborted = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				if (logger.useLogger) logger.warn(`──"${this.name}" was aborted.`);
			};
		} else {
			this.f = () => {
				const result = arg();
				return result instanceof Promise ? result : Promise.resolve(result);
			};
			this.name = name!;
			this.parent = parent!;
			this.child = child!;
			if (onStartCallback)
				this.onStartCallback = function () {
					this._isRunning = true;
					this._startTime = now();
					if (logger.useLogger) logger.log(`"${this.name}" has started.`);
					onStartCallback();
				};
			if (onCompleteCallback)
				this.onCompleteCallback = function () {
					this._isFinished = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					if (logger.useLogger) logger.log(`"${this.name}" has completed.`);
					onCompleteCallback();
				};
			if (onRejectCallback)
				this.onRejectCallback = function () {
					this._isRejected = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					if (logger.useLogger) logger.warn(`"${this.name}" was rejected.`);
					onRejectCallback();
				};
			if (onAbortCallback)
				this.onAbortCallback = function () {
					if (this._isFinished) return;
					this._isAborted = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					if (logger.useLogger) logger.warn(`"${this.name}" was aborted d.`);
					self.onAbortCallback && self.onAbortCallback();
				};
		}

		const self = this;
		const originalFunction = this.f;
		this.f = () => {
			return new Promise((resolve, reject) => {
				self.signal.addEventListener('abort', signal => {
					if (!self._isRunning) return;
					self.onAbortCallback && self.onAbortCallback();
					reject((signal.currentTarget && (signal.currentTarget as AbortSignal).reason) || 'manually aborted.');
				});
				if (this.timeout > 0) {
					setTimeout(() => {
						if (self._isRunning) {
							logger.error(`"${self.name}" has timed out.`);
							self.abort('function timeout');
						}
					}, this.timeout);
				}
				const result = originalFunction();
				if (result instanceof Promise) {
					result.then(resolve).catch(reject);
				} else {
					resolve(result);
				}
			});
		};
	}
}
