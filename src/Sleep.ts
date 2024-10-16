/**
 * Pauses execution for a specified number of seconds, with an option to abort using AbortController.
 * If the `fail` parameter is not provided, it defaults to a random rejection based on the `seconds` value.
 *
 * @param seconds - The number of seconds to sleep (when set to 'undefined' a random timer between 0 and 3 seconds is set).
 * @param fail - Optional. If `true`, the promise will reject after the specified time. If `false`, it will resolve. If `undefined`, it will randomly reject based on the `seconds` value.
 * @returns A promise that resolves after the specified number of seconds, rejects based on the `fail` condition, or aborts if the signal is triggered.
 *
 * @example
 * const sleepPromise = sleep(2, false);
 * sleepPromise
 *   .then((result) => console.log(`Resolved after ${result / 1000} seconds`))
 *   .catch((error) => console.error(error.message));
 *
 * // Abort the sleep after 1 second
 * setTimeout(() => {
 *   sleepPromise.abort();
 * }, 1000);
 */
export async function sleep(seconds: number = Math.random() * 3, fail?: boolean | undefined): Promise<number> {
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

/**
 * Generating documentation during the build step:
 *
 * 1. Install TypeDoc (a documentation generator for TypeScript):
 *    npm install typedoc --save-dev
 *
 * 2. Add a script to your `package.json` to generate documentation:
 *    "scripts": {
 *      "build-docs": "typedoc --out docs src"
 *    }
 *
 * 3. Run the script to generate documentation:
 *    npm run build-docs
 *
 * This will generate documentation in the `docs` folder for your TypeScript code.
 */
