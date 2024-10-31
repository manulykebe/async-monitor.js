import Group from './Group';
import Monitor from './Monitor';
import now from './Now';
import WatchFunction from './WatchFunction';
import {logger} from './Logger';

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

				// _statuses = statusesPromise
				// 	.map((v, i) => ({index: i.toString(), reason: v.reason, onRejectCallback: fs[i].onRejectCallback}))
				// 	.filter(v => v.reason !== undefined);
			})
			.catch(err => {
				if (logger.useLogger) {
					logger.warn('error:', err);
				}
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
					// 			logger.warn('Watch.onRejectCallback is not critical:\n', error);
					// 		}
					// 	}
					// 	// logger.warn('onRejectCallback not provided.');
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
								// 	logger.warn('Error while executing cbf.', error);
								// 	logger.log(cbf);
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
	if (group.functions.filter(x => x.parent === undefined).length < 1) {
		logger.error('Group must have exactly one root function (aka parent === undefined)!');
		return new Promise<void>((resolve, reject) => {
			reject();
		});
	}
	return new Promise<void>((resolve, reject) => {
		_watchAllInternal(group, undefined, resolve, reject);
	});
}

function _watchAllInternal(group: Group, parent: string | undefined, resolve?: () => void, reject?: () => void): void {
	const watches = group.functions;
	const useLogger = group.useLogger;
	const children: WatchFunction[] = watches.filter(x => x.parent === parent);

	if (watches.every(f => f.isFinished)) {
		group.stopTime = now();
		if (group.options.repeat === 0) {
			if (typeof group.onCompleteCallback === 'function') {
				group.onCompleteCallback();
			}
			resolve && resolve();
			return;
		} else if (group.options.repeat > 0) {
			if (typeof group.onCompleteRunCallback === 'function') {
				group.onCompleteRunCallback();
			}

			if (group.options.repeat > group.options.runs) {
				group.options.runs++;
				group.reset(false);
				return _watchAllInternal(group, undefined, resolve, reject);
			} else {
				if (typeof group.onCompleteCallback === 'function') {
					group.onCompleteCallback();
				}
				resolve && resolve();
				return;
			}
		}
	}
	if (watches.some(f => f.isRejected)) {
		if (logger.useLogger) {
			logger.warn('Some watches are rejected.');
		}
		if (typeof group.onRejectCallback === 'function') {
			group.onRejectCallback();
		}
		reject && reject();
		return;
	}
	if (watches.some(f => f.isAborted)) {
		// Some watch was aborted
		if (logger.useLogger) {
			logger.warn('Some watches are aborted.');
		}
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
		if (group.options.repeat > 0) {
			if (typeof group.onStartRunCallback === 'function') group.onStartRunCallback();
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
					logger.highlight(child.name || `g:${group.id},c:${child.id}`, {id: group.id, index: child.id}, 'start');

					if (typeof child.onStartCallback === 'function') {
						child.onStartCallback();
					}

					// try {
					if (typeof child.f === 'function') {
						const result = child.f();
						// If result is void (undefined), log a warning or handle it accordingly
						if (result === undefined || result === null) {
							if (logger.useLogger) {
								logger.warn('Function returned void');
							}
						}
						// Check if result is a promise by checking the presence of the then method
						else if (typeof result.then === 'function') {
							child.promise = result;
							child.promise.then(() => {
								if (typeof child.onCompleteCallback === 'function') {
									child.onCompleteCallback();
								}
								logger.highlight(child.name || `g:${group.id},c:${child.id}`, {id: group.id}, 'complete');
							});

							child.promise.catch(() => {
								if (typeof child.onRejectCallback === 'function') {
									child.onRejectCallback();
								}
								logger.highlight(child.name || `g:${group.id},c:${child.id}`, {id: group.id}, 'rejected');
								logger.highlight('completed', {id: group.id}, 'rejected');
								reject && reject();
							});
						}
						// Handle any other unexpected return values
						else {
							if (logger.useLogger) {
								logger.warn('Function did not return a promise');
							}
						}
					}
					// } catch (error) {
					// if (logger.useLogger) {
					// 	logger.warn('Watch: critical! error in call to (async) function:\n', error);
					// }
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
