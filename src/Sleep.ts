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
