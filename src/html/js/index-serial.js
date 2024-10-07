// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const serialWatches = new Group();

const function_to_watch1 = () => sleep(1, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ false);
const function_to_watch3 = () => sleep(3, /*fail:*/ false);

serialWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'b',
	child: 'c',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'c',
	child: 'd',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

serialWatches.addWatch({
	name: 'build snowflake',
	parent: 'd',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake")');
	},
});

function demo_serial_execution() {
	const treeData = serialWatches._functions.map(f => {
		return {name: f.name, parent: f.parent, child: f.child};
	});

	const treeBuilder = new Tree();
	const treeOutput = treeBuilder.processTree(treeData);
	console.clear();
	console.log(treeOutput);

	serialWatches.reset();
	serialWatches.WatchAll(() => {
		console.table(
			serialWatches._functions.map((f, i) => {
				return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
			}),
		);
	});
}

// Make the functions available in the global scope
window.demo_serial_execution = demo_serial_execution;
// document['serialWatches'] = serialWatches;
