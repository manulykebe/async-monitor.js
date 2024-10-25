export default class Monitor {
	private functions: Promise<any>[];

	constructor(functions: Promise<any>[]) {
		this.functions = functions;
	}

	async settled(): Promise<{statusesPromise: Array<PromiseSettledResult<any>>}> {
		const statusesPromise = await Promise.allSettled(this.functions);
		return {
			statusesPromise,
		};
	}
}
