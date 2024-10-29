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
			mixedWatches.watchAll();
		});

		// Check metrics after execution
	});
});
