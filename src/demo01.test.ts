import {Group, Tree, sleep} from './Index';

describe('addWatch: add a function', () => {
	let mixedWatches: Group;

	beforeEach(() => {
		mixedWatches = new Group();
		mixedWatches.useConsoleLog = false;
		const useConsole = mixedWatches.useConsoleLog;
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

		// // Now run the watches and capture the metrics
		// await new Promise<void>((resolve, reject) => {
		// mixedWatches.watchAll();
		// });

		// // // Check metrics after execution
		// const metrics = mixedWatches.metrics.map(m => ({
		// 	name: m.name,
		// 	sequence: m.sequence,
		// 	start: m.start,
		// 	duration: m.duration,
		// 	isRunning: m.isRunning,
		// 	isFinished: m.isFinished,
		// }));

		// const expectedMetrics = [
		// 	{
		// 		name: 'preparation step',
		// 		sequence: 1,
		// 		start: expect.any(Number),
		// 		duration: 5009,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		name: 'fetch data from ETL store: s1',
		// 		sequence: 2,
		// 		start: expect.any(Number),
		// 		duration: 5005,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		index: 2,
		// 		name: 'fetch data from ETL store: s2',
		// 		sequence: 2,
		// 		start: expect.any(Number),
		// 		duration: 10004,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		index: 3,
		// 		name: 'build snowflake s1 and s2',
		// 		sequence: 5,
		// 		start: expect.any(Number),
		// 		duration: 5010,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		name: 'publish snowflake s1 and s2',
		// 		sequence: 7,
		// 		start: expect.any(Number),
		// 		duration: 5014,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		name: 'fetch data from ETL store: s3',
		// 		sequence: 3,
		// 		start: expect.any(Number),
		// 		duration: 7017,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		name: 'build snowflake from s3',
		// 		sequence: 4,
		// 		start: expect.any(Number),
		// 		duration: 7014,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// 	{
		// 		name: 'publish snowflake s3',
		// 		sequence: 6,
		// 		start: expect.any(Number),
		// 		duration: 7012,
		// 		isRunning: false,
		// 		isFinished: true,
		// 	},
		// ];

		// Assert the metrics
		// expect(metrics).toEqual(expectedMetrics);
	});

	test('should produce correct metrics: 5 sequential functions', async () => {
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));
		mixedWatches.addWatch(() => sleep(1, false));

		// Now run the watches and capture the metrics
		await new Promise<void>((resolve, reject) => {
			mixedWatches.useConsoleLog = false;
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
			expect(received.id).toEqual(expected.id);
			expect(received.name).toEqual(expected.name);
			expect(received.status).toEqual(expected.status);
			expect(received.value).toEqual(expected.value);

			// Allowing some tolerance for timing-related values
			expect(received.duration).toBeCloseTo(expected.duration, -2); // Tolerance of ±100
			expect(received.start).toBeCloseTo(expected.start, -2); // Tolerance of ±100
		});
	}, 10000);
});
