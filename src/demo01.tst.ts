// import {Group, Tree, sleep} from './Index';

// describe('Mixed Execution Test', () => {
// 	let mixedWatches: Group;

// 	beforeEach(() => {
// 		mixedWatches = new Group();
// 		mixedWatches.useConsoleLog = false;
// 		const useConsole = mixedWatches.useConsoleLog;
// 		mixedWatches.addWatch({
// 			name: 'preparation step',
// 			parent: undefined,
// 			child: 'a',
// 			f: () => sleep(1, false),
// 			onStartCallback: function () {
// 				if (useConsole) console.log('++++onStartCallback("preparation step")');
// 			},
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("preparation step")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 			abortController: new AbortController(),
// 		});

// 		mixedWatches.addWatch({
// 			name: 'fetch data from ETL store: s1',
// 			parent: 'a',
// 			child: 'b',
// 			f: () => sleep(1, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'fetch data from ETL store: s2',
// 			parent: 'a',
// 			child: 'b',
// 			f: () => sleep(2, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'build snowflake s1 and s2',
// 			parent: 'b',
// 			child: 'c',
// 			f: () => sleep(1, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("build snowflake from s1 and s2")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'publish snowflake s1 and s2',
// 			parent: 'c',
// 			child: 'x',
// 			f: () => sleep(1, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("publish snowflake s1 and s2")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'fetch data from ETL store: s3',
// 			parent: 'a',
// 			child: 'd',
// 			f: () => sleep(3, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'build snowflake from s3',
// 			parent: 'd',
// 			child: 'e',
// 			f: () => sleep(1, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("build snowflake from s3")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});

// 		mixedWatches.addWatch({
// 			name: 'publish snowflake s3',
// 			parent: 'e',
// 			child: 'f',
// 			f: () => sleep(1, false),
// 			onCompleteCallback: function () {
// 				if (useConsole) console.log('++++onCompleteCallback("publish snowflake s3")');
// 			},
// 			_startTime: 0,
// 			_stopTime: 0,
// 			_duration: 0,
// 		});
// 	});

// 	test('should produce correct tree output and metrics', async () => {
// 		// Prepare tree data
// 		const treeData = mixedWatches._functions.map(f => ({
// 			name: f.name,
// 			parent: f.parent,
// 			child: f.child,
// 		}));

// 		// Build the tree
// 		const treeBuilder = new Tree();
// 		const treeOutput = treeBuilder.processTree(treeData);

// 		const expectedOutput = [
// 			'── preparation step',
// 			'   ├─ fetch data from ETL store: s1, fetch data from ETL store: s2',
// 			'   │  └─ build snowflake s1 and s2',
// 			'   │     └─ publish snowflake s1 and s2─────────────────────────────┐',
// 			'   └─ fetch data from ETL store: s3                                 │',
// 			'      └─ build snowflake from s3                                    │',
// 			'         └─ publish snowflake s3────────────────────────────────────┤',
// 			'                                                                    └─ completed',
// 		];

// 		// Assert the tree structure
// 		expect(treeOutput.split('\r\n')).toEqual(expectedOutput);

// 		// Now run the watches and capture the metrics
// 		await new Promise<void>((resolve, reject) => {
// 			mixedWatches.watchAll(
// 				() => {
// 					if (mixedWatches.useConsoleLog) console.log('All watches completed');
// 					resolve();
// 				},
// 				() => {
// 					console.error('Watches failed');
// 					reject();
// 				},
// 			);
// 		});

// 		// // Check metrics after execution
// 		const metrics = mixedWatches.metrics.map(m => ({
// 			index: m.index,
// 			name: m.name,
// 			sequence: m.sequence,
// 			start: m.start,
// 			duration: m.duration,
// 			f: m.f.toString(),
// 			isRunning: m.isRunning,
// 			isFinished: m.isFinished,
// 		}));

// 		const expectedMetrics = [
// 			{
// 				index: 0,
// 				name: 'preparation step',
// 				sequence: 1,
// 				start: expect.any(Number),
// 				duration: 5009,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 1,
// 				name: 'fetch data from ETL store: s1',
// 				sequence: 2,
// 				start: expect.any(Number),
// 				duration: 5005,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 2,
// 				name: 'fetch data from ETL store: s2',
// 				sequence: 2,
// 				start: expect.any(Number),
// 				duration: 10004,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 3,
// 				name: 'build snowflake s1 and s2',
// 				sequence: 5,
// 				start: expect.any(Number),
// 				duration: 5010,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 4,
// 				name: 'publish snowflake s1 and s2',
// 				sequence: 7,
// 				start: expect.any(Number),
// 				duration: 5014,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 5,
// 				name: 'fetch data from ETL store: s3',
// 				sequence: 3,
// 				start: expect.any(Number),
// 				duration: 7017,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 6,
// 				name: 'build snowflake from s3',
// 				sequence: 4,
// 				start: expect.any(Number),
// 				duration: 7014,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 			{
// 				index: 7,
// 				name: 'publish snowflake s3',
// 				sequence: 6,
// 				start: expect.any(Number),
// 				duration: 7012,
// 				f: expect.any(String),
// 				isRunning: false,
// 				isFinished: true,
// 			},
// 		];

// 		// Assert the metrics
// 		// expect(metrics).toEqual(expectedMetrics);
// 	}, 60000);
// });
