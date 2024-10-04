import Group from './Group';
import type {WatchFunction} from './Group';

export default class Element implements WatchFunction {
	sequence: number | undefined;
	parent: string | undefined;
	child: string | undefined;
	group?: Group | undefined;
	promise?: Promise<any>;
	f: () => void;
	onStartCallback: (() => void) | undefined = () => {};
	onCompleteCallback: (() => void) | undefined = () => {};
	onRejectCallback: (() => void) | undefined = () => {};
	_isFinished: boolean = false;
	_isRunning: boolean = false;
	_index?: number | undefined;
	_startTime: number = 0;
	_stopTime: number = 0;
	_duration: number = 0;

	constructor(
		arg: (() => void) | WatchFunction,
		parent: string = '',
		child: string = '',
		onStartCallback: () => void = () => {},
		onCompleteCallback: () => void = () => {},
		onRejectCallback: () => void = () => {},
		_startTime: number = 0,
		_stopTime: number = 0,
		_duration: number = 0,
	) {
		if (typeof arg === 'object') {
			// If an object of type WatchFunction is passed, use its properties
			this.f = arg.f;
			this.parent = arg.parent;
			this.child = arg.child;
			this.onStartCallback = arg.onStartCallback;
			this.onCompleteCallback = arg.onCompleteCallback;
			this.onRejectCallback = arg.onRejectCallback;
		} else {
			// If a function is passed, assign the passed or default values for other properties
			this.f = arg;
			this.parent = parent;
			this.child = child;
			this.onStartCallback = onStartCallback;
			this.onCompleteCallback = onCompleteCallback;
			this.onRejectCallback = onRejectCallback;
		}

		this._isFinished = false;
		this._isRunning = false;
	}
}
