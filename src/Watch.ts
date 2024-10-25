import Group from './Group';
import Monitor from './Monitor';
import now, {calcDuration} from './Now';
import WatchFunction from './WatchFunction';

export class Watch {
	constructor(fs: Array<WatchFunction>, f: (() => void) | Array<() => void>) {
		let breakOnReject = false;
		// let _statuses: Array<{index: string; reason: any; onRejectCallback?: (reason: any) => void}> = [];

		// Filter out entries where promise is undefined
		const promises: Promise<any>[] = fs.map(x => x.promise);
		const monitorInstance = new Monitor(promises);

		return monitorInstance
			.settled()
			.then(({statusesPromise}: {statusesPromise: Array<PromiseSettledResult<any>>}) => {
				for (let i = 0; i < statusesPromise.length; i++) {
					fs[i].promiseStatus.status = statusesPromise[i].status;
					fs[i].promiseStatus.reason =
						statusesPromise[i].status === 'rejected' ? (statusesPromise[i] as PromiseRejectedResult).reason : undefined;
					fs[i].promiseStatus.value =
						statusesPromise[i].status === 'fulfilled'
							? (statusesPromise[i] as PromiseFulfilledResult<any>).value
							: undefined;
				}

				breakOnReject = statusesPromise.some(x => x.status === 'rejected');

				if (breakOnReject) debugger;
				// _statuses = statusesPromise
				// 	.map((v, i) => ({index: i.toString(), reason: v.reason, onRejectCallback: fs[i].onRejectCallback}))
				// 	.filter(v => v.reason !== undefined);
			})
			.catch(err => {
				console.warn('error:', err);
			})
			.finally(() => {
				if (breakOnReject) {
					const fs0 = fs[0];
					// if (typeof fs0.group?.__callback_error === 'function') fs0.group.__callback_error();
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

					if (fs0.group && typeof fs0.group.onRejectCallback === 'function') fs0.group.onRejectCallback();

					return;
				} else {
					if (!Array.isArray(f)) f = [f];
					if (Array.isArray(f)) {
						f.forEach(cbf => {
							if (typeof cbf === 'function') {
								// try {
								cbf();
								// } catch (error) {
								// 	console.warn('Error while executing cbf.', error);
								// 	console.log(cbf);
								// }
							}
						});
					}
				}
			});
	}
}

let _sequence = 0;
export async function watchAll(
	group: Group,
	onStartCallback?: () => void,
	onCompleteCallback?: () => void,
	onRejectCallback?: () => void,
	onAbortCallback?: () => void,
): Promise<void> {
	if (typeof onStartCallback === 'function') group.onStartCallback = onStartCallback;
	if (typeof onCompleteCallback === 'function') group.onCompleteCallback = onCompleteCallback;
	if (typeof onRejectCallback === 'function') group.onRejectCallback = onRejectCallback;
	if (typeof onAbortCallback === 'function') group.onAbortCallback = onAbortCallback;
	return new Promise<void>((resolve, reject) => {
		_watchAllInternal(group, undefined, resolve, reject);
	});
}

function _watchAllInternal(group: Group, parent: string | undefined, resolve?: () => void, reject?: () => void): void {
	const watches = group.functions;
	const useConsoleLog = group.useConsoleLog;
	const children: WatchFunction[] = watches.filter(x => x.parent === parent);

	if (watches.every(f => f.isFinished)) {
		if (group.options.repeat === 0 || (group.options.repeat > 0 && group.options.repeat <= (group.options.runs || 0))) {
			// All watches are finished
			group.stopTime = now();
			group.duration = calcDuration(group.startTime, group.stopTime);
			if (typeof group.onCompleteCallback === 'function') {
				group.onCompleteCallback();
			}
			resolve && resolve();
			return;
		} else {
			group.options.runs = (group.options.runs ?? 1) + 1;
			group.reset(false);
		}
	}
	if (watches.some(f => f.isRejected)) {
		console.warn('Some watch was rejected');
		if (typeof group.onRejectCallback === 'function') {
			group.onRejectCallback();
		}
		reject && reject();
		return;
	}
	if (watches.some(f => f.isAborted)) {
		// Some watch was aborted
		console.warn('Some watch was aborted');
		if (typeof group.onAbortCallback === 'function') {
			group.onAbortCallback();
		}
		reject && reject();
		return;
	}

	if (parent === undefined) {
		if (children.length === 0) {
			return;
		}
		_sequence = 0;
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
					child.sequence = _sequence;
					useConsoleLog && console.highlight(child.name, {id: group.id, index: child.id}, 'start');

					if (typeof child.onStartCallback === 'function') {
						child.onStartCallback();
					}

					// try {
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
					// } catch (error) {
					// 	console.warn('Watch: critical! error in call to (async) function:\n', error);
					// 	if (typeof group.onErrorCallback === 'function') group.onErrorCallback();
					// 	return;
					// }
				});
		});
		if (group.isFinished) {
		} else {
			grandChildren.forEach(gc => {
				const validChildren: WatchFunction[] = children
					.filter(c => c.child === gc)
					.map(child => {
						child.promise = child.promise ?? Promise.resolve();
						return child;
					});

				new Watch(validChildren, [
					() => {
						watches
							.filter(x => x.parent === parent)
							.filter(function (c) {
								return c.child === gc;
							})
							.map(x => x.child)
							.filter((currentValue, index, arr) => arr.indexOf(currentValue) === index)
							.forEach(x => {
								_watchAllInternal(group, x, resolve, reject);
							});
					},
				]);
			});
		}
	}
}
