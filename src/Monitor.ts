export default class Monitor {
	private fs: Promise<any>[]; // Store the promises array

	constructor(fs: Promise<any>[]) {
		this.fs = fs;
	}

	// Method to handle the async operation
	async monitorStatuses(): Promise<{performance: number; statusesPromise: Array<PromiseSettledResult<any>>}> {
		const statusesPromise = await Promise.allSettled(this.fs);
		return {
			performance: performance.now(),
			statusesPromise,
		};
	}
}
