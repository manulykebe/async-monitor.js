/**
 * The sleep function pauses execution for a specified amount of time. Useful for testing purposes as it
 * has a random option when param fail is not set.
 *
 * @param seconds - The number of seconds (default is a random number between 0 and 3).
 * @param fail - Whether the function should reject or not (default is `false`).
 * @returns A promise that resolves after `seconds` seconds or rejects based on the `fail` condition.
 */
export async function sleep(seconds: number = Math.random() * 3, fail?: boolean | undefined): Promise<number> {
	if (fail === undefined) fail = seconds / 3 < 0.5;
	seconds = seconds * 1000;

	return new Promise<number>((resolve, reject) => {
		setTimeout(() => {
			if (fail) {
				reject(seconds);
			} else {
				resolve(seconds);
			}
		}, seconds);
	});
}
/**
 * Pauses execution for a specified number of seconds, with an option to abort using AbortController. This function is useful for testing purposes, especially for handling cascaded/bubbled abort signals.
 * If the `fail` parameter is not provided, it defaults to a random rejection based on the `seconds` value.
 *
 * @param seconds - The number of seconds to sleep (if set to `undefined`, a random duration between 0 and 3 seconds is used).
 * @param fail - Optional. If `true`, the promise will reject after the specified time. If `false`, it will resolve. If `undefined`, it will randomly reject based on the `seconds` value.
 * @returns A promise that resolves after the specified number of seconds, rejects based on the `fail` condition, or aborts if the signal is triggered.
 *
 * @example
 * const sleepPromiseWithAbort = sleepWithAbort(2, false);
 * sleepPromiseWithAbort
 *   .then((result) => logger.log(`Resolved after ${result / 1000} seconds`))
 *   .catch((error) => logger.error(error.message));
 *
 * // Abort the sleep after 1 second
 * setTimeout(() => {
 *   sleepPromiseWithAbort.abort();
 * }, 1000);
 */
export async function sleepWithAbort(seconds: number = Math.random() * 3, fail?: boolean | undefined): Promise<number> {
	if (fail === undefined) fail = seconds / 3 < 0.5;
	seconds = seconds * 1000;

	const controller = new AbortController();
	const signal = controller.signal;

	const promise = new Promise<number>((resolve, reject) => {
		const timeoutId = setTimeout(() => {
			if (fail) {
				reject(new Error(`Rejected after ${seconds / 1000} seconds`));
			} else {
				resolve(seconds);
			}
		}, seconds);

		signal.addEventListener('abort', () => {
			clearTimeout(timeoutId);
			reject(new Error('Sleep aborted'));
		});
	});

	(promise as any).abort = () => controller.abort();

	return promise;
}
