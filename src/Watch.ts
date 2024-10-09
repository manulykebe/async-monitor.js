import Group, {type WatchFunction} from './Group';
import Monitor from './Monitor';

export const useConsole = true;

export class Watch {
	constructor(
		fs: Array<{promise: Promise<any> | void; onRejectCallback?: (reason: any) => void; group?: Group}>,
		f: (() => void) | Array<() => void>,
		fr?: () => void, // f_rejected globally
	) {
		let _breakOnRejected = false;
		let _statuses: Array<{index: string; reason: any; onRejectCallback?: (reason: any) => void}> = [];

		// Filter out entries where promise is undefined
		const validFs: Promise<any>[] = fs
			.filter(
				(x): x is {promise: Promise<any>; onRejectCallback?: (reason: any) => void} => x.promise instanceof Promise,
			)
			.map(x => x.promise);
		const monitorInstance = new Monitor(validFs);

		// (document as any)['monitorInstance'] = monitorInstance;

		return monitorInstance
			.monitorStatuses()
			.then((statuses: {performance: number; statusesPromise: Array<{status: string; reason?: any}>}) => {
				if (statuses.statusesPromise.length > 1) {
					useConsole && console.log(`statuses: ${statuses.statusesPromise.map(x => x.status.toString()).join(',')}`);
				} else {
					useConsole && console.log(`status: ${statuses.statusesPromise.map(x => x.status.toString()).join(',')}`);
				}
				_breakOnRejected = statuses.statusesPromise.some(x => x.status === 'rejected');
				_statuses = statuses.statusesPromise
					.map((v, i) => ({index: i.toString(), reason: v.reason, onRejectCallback: fs[i].onRejectCallback}))
					.filter(v => v.reason !== undefined);
			})
			.catch(err => {
				console.warn('error:', err);
			})
			.finally(() => {
				if (_breakOnRejected) {
					console.warn('Promise rejected...');
					const fs0 = fs[0];
					if (fs0.group && typeof fs0.group._onRejectedCallback === 'function') fs0.group._onRejectedCallback();
					if (fs0.group && typeof fs0.group._onCompleteCallback === 'function') fs0.group._onCompleteCallback();

					// f_rejected for specific function
					_statuses.forEach(x => {
						if (typeof x.onRejectCallback === 'function') {
							try {
								x.onRejectCallback(x.reason);
							} catch (error) {
								console.warn('Watch.onRejectCallback is not critical:\n', error);
							}
						}
						console.warn('onRejectCallback not provided.');
					});

					// f_rejected for global watch
					if (typeof fr === 'function') fr();
					return;
				} else {
					if (typeof f === 'function') f();
					if (Array.isArray(f)) {
						f.forEach(callback => {
							if (typeof callback === 'function') {
								try {
									callback();
								} catch (error) {
									console.warn('Watch.onCompleteCallback is not critical:\n', error);
								}
							}
						});
					}
				}
			});
	}
}

let _sequence = 0;

export function WatchAll(group: Group, callback: (() => void) | undefined, callback_error?: () => void): void {
	// Call the private function with the default parent value as undefined
	_watchAllInternal(group, undefined, callback, callback_error);
}

function _watchAllInternal(
	group: Group,
	parent: string | undefined,
	callback: (() => void) | undefined,
	callback_error?: () => void,
): void {
	const watches = group._functions;
	if (watches.every(f => f._isFinished)) {
		// All watches are finished
		group._stopTime = Date.now();
		group._duration = group._stopTime - group._startTime;
		if (typeof group._onCompleteCallback === 'function') group._onCompleteCallback();
		return;
	}

	if (typeof parent === 'function') {
		callback_error = callback as () => void;
		callback = parent as () => void;
		parent = undefined;
	}

	const children: WatchFunction[] = watches.filter(x => x.parent === parent);

	if (parent === undefined) {
		if (children.length === 0) {
			console.warn('Nothing to do.');
			if (typeof group._onCompleteCallback === 'function') group._onCompleteCallback();
			return;
		}
		_sequence = 0;
		watches.forEach((x, i) => (x._index = i));
	}

	if (children.length > 0) {
		const grandChildren = children
			.map(x => x.child)
			.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index);
		grandChildren.forEach(gc => {
			_sequence++;
			children
				.filter(c => c.child === gc)
				.forEach(child => {
					child._isRunning = true;
					child._startTime = Date.now();
					child.sequence = _sequence;
					useConsole && (console as any).highlight(child.name, 'start');

					if (typeof child.onStartCallback === 'function') {
						try {
							child.onStartCallback();
						} catch (error) {
							console.warn(`Watch: onStartCallback failed (sequence: ${child.sequence}):\n`, error);
						}
					}

					try {
						if (typeof child.f === 'function') {
							const result = child.f();
							// If result is void (undefined), log a warning or handle it accordingly
							if (result === undefined || result === null) {
								console.warn('Function returned void');
							}
							// Check if result is a promise by checking the presence of the then method
							else if (typeof result.then === 'function') {
								child.promise = result;
								child.promise.then(() => {
									if (typeof child.onCompleteCallback === 'function') {
										child.onCompleteCallback();
									} else {
										console.warn('onCompleteCallback is not defined or not a function');
									}
									child._isRunning = false;
									child._isFinished = true;
									child._stopTime = Date.now();
									child._duration = child._stopTime - (child._startTime || 0);
									useConsole && (console as any).highlight(child.name, 'complete');
								});
							}
							// Handle any other unexpected return values
							else {
								console.warn('Function did not return a promise');
							}
						}
					} catch (error) {
						console.warn('Watch: critical! error in call to (async) function:\n', error);
						child._stopTime = Date.now();
						child._duration = child._stopTime - child._startTime;
						child._isRunning = false;
						if (typeof group._onUnCompleteCallback === 'function') group._onUnCompleteCallback();
						return;
					}
				});
		});
		if (!group._isFinished) {
			grandChildren.forEach(gc => {
				const validChildren = children
					.filter(c => c.child === gc)
					.map(child => ({
						promise: child.promise ?? Promise.resolve(),
						onRejectCallback: child.onRejectCallback,
						group: child.group,
					}));

				new Watch(
					validChildren,
					[
						() => {
							if (!watches.some(x => x._isRunning) && watches.every(x => x._isFinished)) {
								if (typeof callback === 'function') callback();
							}

							watches
								.filter(x => x.parent === parent)
								.filter(function (c) {
									return c.child === gc;
								}) // && !x._isRunning && !x._isFinished)
								.map(x => x.child)
								.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index)
								.forEach(x => {
									_watchAllInternal(group, x, callback, callback_error);
								});
						},
					],
					callback_error,
				);
			});
		}
	}
}
