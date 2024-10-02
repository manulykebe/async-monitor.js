import Group, {type WatchFunction} from './Group';
import Monitor from './Monitor';

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

		(document as any)['monitorInstance'] = monitorInstance;

		return monitorInstance
			.monitorStatuses()
			.then((statuses: {performance: number; statusesPromise: Array<{status: string; reason?: any}>}) => {
				console.log(`status(es): ${statuses.statusesPromise.map(x => x.status.toString()).join(',')}`);

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
					console.warn('Afgebroken omwille van een afgewezen belofte...');
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
						console.warn(new Error(x.reason));
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

export function WatchAll(
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
			console.warn('Niets te doen...');
			if (typeof group._onCompleteCallback === 'function') group._onCompleteCallback();
			return;
		}
		_sequence = 0;
		watches.forEach((x, i) => (x._index = i));
	}

	if (children.length > 0) {
		children.forEach(child => {
			child._isRunning = true;
			child._startTime = Date.now();
			child.sequence = _sequence;

			try {
				child.promise = child.f();
			} catch (error) {
				console.warn('Watch: critical! error in call to (async) function:\n', error);
				child._stopTime = Date.now();
				child._duration = child._stopTime - child._startTime;
				child._isRunning = false;
				if (typeof group._onUnCompleteCallback === 'function') group._onUnCompleteCallback();
				return;
			}
		});

		if (!group._isFinished) {
			const onCompleteCallback: (() => void)[] = children
				.map(child => child.onCompleteCallback)
				.filter(child => !!child);

			// Modify this part to ensure promises are provided in the expected format.
			const validChildren = children.map(child => ({
				promise: child.promise ?? Promise.resolve(), // Ensure promise is always defined
				onRejectCallback: child.onRejectCallback,
				group: child.group,
			}));

			new Watch(
				validChildren,
				[
					...onCompleteCallback,
					() => {
						children.forEach(child => {
							child._isRunning = false;
							child._isFinished = true;
							child._stopTime = Date.now();
							child._duration = child._stopTime - (child._startTime || 0);
						});

						if (!watches.some(x => x._isRunning) && watches.every(x => x._isFinished)) {
							if (typeof callback === 'function') callback();
						}

						_sequence++;

						watches
							.filter(x => x.parent === parent)
							.map(x => x.child)
							.forEach(x => {
								WatchAll(group, x, callback, callback_error);
							});
					},
				],
				callback_error,
			);
		}
	}
}
