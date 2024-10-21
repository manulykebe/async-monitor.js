import Group from './Group';
import Monitor from './Monitor';
import now, {calcDuration} from './Now';
import WatchFunction from './WatchFunction';

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
				// if (statuses.statusesPromise.length > 1) {
				// 	useConsoleLog && console.log(`statuses: ${statuses.statusesPromise.map(x => x.status.toString()).join(',')}`);
				// } else {
				// 	useConsoleLog && console.log(`status: ${statuses.statusesPromise.map(x => x.status.toString()).join(',')}`);
				// }
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
					const fs0 = fs[0];
					if (typeof fs0.group?.__callback_error === 'function') fs0.group.__callback_error();
					// if (fs0.group && typeof fs0.group._onRejectedCallback === 'function') fs0.group._onRejectedCallback();
					// if (fs0.group && typeof fs0.group._onCompleteCallback === 'function') fs0.group._onCompleteCallback();
					// // f_rejected for specific function
					// _statuses.forEach(x => {
					// 	if (typeof x.onRejectCallback === 'function') {
					// 		try {
					// 			x.onRejectCallback(x.reason);
					// 		} catch (error) {
					// 			console.warn('Watch.onRejectCallback is not critical:\n', error);
					// 		}
					// 	}
					// 	// console.warn('onRejectCallback not provided.');
					// });
					// // f_rejected for global watch
					// if (typeof fr === 'function') fr();
					console.warn('Some watch was rejected xxx');
					return;
				} else {
					if (!Array.isArray(f)) f = [f];
					if (Array.isArray(f)) {
						f.forEach(cbf => {
							if (typeof cbf === 'function') {
								try {
									cbf();
								} catch (error) {
									console.warn('Error while executing cbf.', error);
									console.log(cbf);
								}
							}
						});
					}
				}
			});
	}
}

export class Progress {
	constructor(group: Group) {
		// Call the private function with the default parent value as undefined
	}
}
let _sequence = 0;
export async function WatchAll(group: Group, onStartCallback?: () => void, callback_error?: () => void): Promise<void> {
	// Call the private function with the default parent value as undefined
	return new Promise<void>((resolve, reject) => {
		_watchAllInternal(group, undefined, onStartCallback, callback_error, resolve, reject);
	});
}

function _watchAllInternal(
	group: Group,
	parent: string | undefined,
	onStartCallback: (() => void) | undefined,
	callback_error?: () => void,
	resolve?: () => void,
	reject?: () => void,
): void {
	const watches = group.functions;
	const useConsoleLog = group.useConsoleLog;
	if (watches.every(f => f.isFinished)) {
		// All watches are finished
		group.stopTime = now();
		group.duration = calcDuration(group.startTime, group.stopTime);
		if (typeof group.onCompleteCallback === 'function') {
			group.onCompleteCallback();
			resolve && resolve();
		}
		return;
	}
	if (watches.some(f => f.isRejected)) {
		// Some watch was rejected
		console.warn('Some watch was rejected');
		reject && reject();
		return;
	}

	if (typeof parent === 'function') {
		callback_error = onStartCallback as () => void;
		onStartCallback = parent as () => void;
		parent = undefined;
	}

	const children: WatchFunction[] = watches.filter(x => x.parent === parent);

	if (parent === undefined) {
		if (children.length === 0) {
			console.warn('Nothing to do.');
			console.warn('Nothing to do.');
			if (typeof group.onCompleteCallback === 'function') group.onCompleteCallback();
			return;
		}
		_sequence = 0;
		// watches.forEach((x, i) => (x._index = i));
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
					useConsoleLog && console.highlight(child.name, {id: group.id}, 'start');

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
									useConsoleLog && console.highlight(child.name, {id: group.id}, 'complete');
								});

								child.promise.catch(() => {
									if (typeof child.onRejectCallback === 'function') {
										child.onRejectCallback();
									} else {
										console.warn('onRejectCallback is not defined or not a function');
									}
									if (useConsoleLog) {
										console.highlight(child.name, {id: group.id}, 'rejected');
										console.highlight('completed', {id: group.id}, 'rejected');
									}
									reject && reject();
								});
							}
							// Handle any other unexpected return values
							else {
								console.warn('Function did not return a promise');
							}
						}
					} catch (error) {
						console.warn('Watch: critical! error in call to (async) function:\n', error);
						if (typeof group._onUnCompleteCallback === 'function') group._onUnCompleteCallback();
						return;
					}
				});
		});
		if (!group.isFinished) {
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
							if (!watches.some(x => x.isRunning) && watches.every(x => x.isFinished)) {
								if (typeof onStartCallback === 'function') onStartCallback();
							}

							watches
								.filter(x => x.parent === parent)
								.filter(function (c) {
									return c.child === gc;
								}) // && !x._isRunning && !x._isFinished)
								.map(x => x.child)
								.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index)
								.forEach(x => {
									_watchAllInternal(group, x, onStartCallback, callback_error, resolve, reject);
								});
						},
					],
					callback_error,
				);
			});
		}
	}
}
