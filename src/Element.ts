import Group from './Group';
import type {WatchFunction} from './Group';

export default class Element implements WatchFunction {
	child: string | undefined;
	group?: Group | undefined;
	parent: string | undefined;
	sequence: number | undefined;
	promise?: Promise<any>;
	f: () => void;
	onStartCallback: (() => void) | undefined = () => {};
	onCompleteCallback: (() => void) | undefined = () => {};
	onRejectCallback: (() => void) | undefined = () => {};
	_isFinished: boolean;
	_isRunning: boolean;
	_index?: number | undefined;
	_startTime: number = 0;
	_stopTime: number = 0;

	constructor(
		f: (() => void) | WatchFunction,
		parent?: string,
		child?: string,
		onCompleteCallback?: () => void,
		onRejectCallback?: () => void,
	) {
		if (typeof f === 'object') {
			// If an object of type WatchFunction is passed, use its properties
			this.f = f.f;
			this.parent = f.parent;
			this.child = f.child;
			this.onCompleteCallback = f.onCompleteCallback;
			this.onRejectCallback = f.onRejectCallback;
		} else {
			// If a function is passed, assign the passed or default values for other properties
			this.f = f;
			this.parent = parent;
			this.child = child;
			this.onCompleteCallback = onCompleteCallback;
			this.onRejectCallback = onRejectCallback;
		}

		this._isFinished = false;
		this._isRunning = false;
	}
}
