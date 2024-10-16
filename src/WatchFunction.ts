import Group from './Group';
import now, {calcDuration} from './Now';
import Sequence from './Sequence';

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
};

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
	private _index?: number | undefined;
	private _startTime: number = 0;
	private _stopTime: number = 0;
	private _duration: number = 0;

	private abortController: AbortController = new AbortController();
	abort = () => this.abortController.abort();
	signal: AbortSignal = this.abortController.signal;

	name: string;
	parent: string;
	child: string;
	group?: Group | undefined;
	f: () => Promise<any> | void;
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
		this._index = undefined;
		this._startTime = 0;
		this._stopTime = 0;
		this._duration = 0;
		this.sequence = 0;
		this.abortController = new AbortController();
		this.signal = this.abortController.signal;
		this.abort = () => this.abortController.abort();
	};

	'promise': Promise<any>;
	get metrics(): Metric {
		return {
			id: this._id!,
			name: this.name,
			start: this.group ? this._startTime - this.group._startTime : 0,
			duration: this._duration,
			isRunning: this._isRunning,
			isFinished: this._isFinished,
			isRejected: this._isRejected,
			isAborted: this._isAborted,
			sequence: this.sequence,
		};
	}

	constructor(
		arg:
			| {
					f: () => Promise<any> | void;
					name: string;
					parent: string;
					child: string;
					onStartCallback?: () => void;
					onCompleteCallback?: () => void;
					onRejectCallback?: () => void;
					onAbortCallback?: () => void;
			  }
			| (() => Promise<any> | void),
		name?: string,
		parent?: string,
		child?: string,
		onStartCallback?: () => void,
		onCompleteCallback?: () => void,
		onRejectCallback?: () => void,
		onAbortCallback?: () => void,
	) {
		if (typeof arg === 'object') {
			this.f = arg.f;
			this.name = arg.name;
			this.parent = arg.parent;
			this.child = arg.child;

			this.onStartCallback = () => {
				this._isRunning = true;
				this._startTime = now();
				console.log(`"${this.name}" has started.`);
				if (arg.onStartCallback) arg.onStartCallback!();
			};

			this.onCompleteCallback = () => {
				this._isFinished = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				console.log(`"${this.name}" has completed.`);
				if (arg.onCompleteCallback) arg.onCompleteCallback!();
			};

			this.onRejectCallback = () => {
				if (this._isAborted) return;
				this._isRejected = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				console.warn(`"${this.name}" was rejected.`);
				if (arg.onRejectCallback) arg.onRejectCallback!();
			};
			this.onAbortCallback = () => {
				this._isAborted = true;
				this._isRunning = false;
				this._stopTime = now();
				this._duration = calcDuration(this._startTime, this._stopTime);
				console.warn(`"${this.name}" was aborted.`);
				if (arg.onAbortCallback) arg.onAbortCallback!();
			};
		} else {
			this.f = arg;
			this.name = name!;
			this.parent = parent!;
			this.child = child!;
			if (onStartCallback)
				this.onStartCallback = () => {
					this._isRunning = true;
					this._startTime = now();
					console.log(`"${this.name}" has started.`);
					onStartCallback();
				};
			if (onCompleteCallback)
				this.onCompleteCallback = () => {
					this._isFinished = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					console.log(`"${this.name}" has completed.`);
					onCompleteCallback();
				};
			if (onRejectCallback)
				this.onRejectCallback = () => {
					this._isRejected = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					console.warn(`"${this.name}" was rejected.`);
					onRejectCallback();
				};
			if (onAbortCallback)
				this.onAbortCallback = () => {
					this._isAborted = true;
					this._isRunning = false;
					this._stopTime = now();
					this._duration = calcDuration(this._startTime, this._stopTime);
					console.warn(`"${this.name}" was aborted.`);
					onAbortCallback();
				};
		}

		const self = this;
		const originalFunction = this.f;
		this.f = () => {
			return new Promise((resolve, reject) => {
				self.signal.addEventListener('abort', () => {
					self.onAbortCallback && self.onAbortCallback();
					reject(`"${self.name}" was aborted.`);
				});
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
