import {Group, Tree, sleep} from './Index';

describe('addWatch: add a function', () => {
	let mixedWatches: Group;

	beforeEach(() => {
		mixedWatches = new Group();
		mixedWatches.useConsoleLog = false;
	});

	test('should produce correct tree: 2 sequential functions', async () => {
		mixedWatches.addWatch(() => sleep(undefined, false));
		mixedWatches.addWatch(() => sleep(undefined, false));
		const treeOutput = mixedWatches.consoleTree;

		const expectedOutput = [
			'─── watch-function-1',
			'    └─ watch-function-2──┐',
			'                         └─ completed',
		];

		// Assert the tree structure
		expect(treeOutput.split('\r\n')).toEqual(expectedOutput);
	});

	test('should produce correct tree: 5 sequential functions', async () => {
		mixedWatches.addWatch(() => sleep(undefined, false));
		mixedWatches.addWatch(() => sleep(undefined, false));
		mixedWatches.addWatch(() => sleep(undefined, false));
		mixedWatches.addWatch(() => sleep(undefined, false));
		mixedWatches.addWatch(() => sleep(undefined, false));
		const treeOutput = mixedWatches.consoleTree;

		const expectedOutput = [
			'─── watch-function-1',
			'    └─ watch-function-2',
			'       └─ watch-function-3',
			'          └─ watch-function-4',
			'             └─ watch-function-5─────┐',
			'                                     └─ completed',
		];

		// Assert the tree structure
		expect(treeOutput.split('\r\n')).toEqual(expectedOutput);
	});

	test('should produce correct metrics: 5 sequential functions', async () => {
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));

		// Now run the watches and capture the metrics
		await new Promise<void>((resolve, reject) => {
			mixedWatches.onCompleteCallback = resolve;
			mixedWatches.watchAll();
		});
		const expectedMetrics = [
			{
				id: 1,
				name: 'watch-function-1',
				start: 0,
				duration: 1056,
				status: 'fulfilled',
				value: 1000,
				reason: undefined,
				isRunning: false,
				isFinished: true,
				isRejected: false,
				isAborted: false,
				sequence: 1,
			},
			{
				id: 2,
				name: 'watch-function-2',
				start: 1062,
				duration: 1005,
				status: 'fulfilled',
				value: 1000,
				reason: undefined,
				isRunning: false,
				isFinished: true,
				isRejected: false,
				isAborted: false,
				sequence: 2,
			},
			{
				id: 3,
				name: 'watch-function-3',
				start: 2071,
				duration: 1006,
				status: 'fulfilled',
				value: 1000,
				reason: undefined,
				isRunning: false,
				isFinished: true,
				isRejected: false,
				isAborted: false,
				sequence: 3,
			},
			{
				id: 4,
				name: 'watch-function-4',
				start: 3081,
				duration: 1012,
				status: 'fulfilled',
				value: 1000,
				reason: undefined,
				isRunning: false,
				isFinished: true,
				isRejected: false,
				isAborted: false,
				sequence: 4,
			},
			{
				id: 5,
				name: 'watch-function-5',
				start: 4095,
				duration: 1015,
				status: 'fulfilled',
				value: 1000,
				reason: undefined,
				isRunning: false,
				isFinished: true,
				isRejected: false,
				isAborted: false,
				sequence: 5,
			},
		];
		// Check metrics after execution
		mixedWatches.metrics.forEach((received, index) => {
			const expected = expectedMetrics[index];
			// expect(received.id).toEqual(expected.id);
			expect(received.name).toEqual(expected.name);
			expect(received.status).toEqual(expected.status);
			expect(received.value).toEqual(expected.value);

			// Allowing some tolerance for timing-related values
			expect(received.duration).toBeCloseTo(expected.duration, -2); // Tolerance of ±100
			expect(received.start).toBeCloseTo(expected.start, -2); // Tolerance of ±100
		});
	}, 20000);
});
