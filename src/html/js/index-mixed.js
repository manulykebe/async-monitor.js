// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const mixedWatches = new Group();

const function_to_watch1 = () => sleep(1, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ false);
const function_to_watch3 = () => sleep(3, /*fail:*/ false);

mixedWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'a',
	child: 'b',
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake',
	parent: 'b',
	child: 'c',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s1 & s2")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'a',
	child: 'd',
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake',
	parent: 'd',
	child: 'e',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s3")');
	},
});

mixedWatches.addWatch({
	name: 'publish snowflake',
	parent: 'e',
	child: 'f',
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("publish snowflake")');
	},
});

function demo_mixed_execution() {
	const treeData = mixedWatches._functions.map(f => {
		return {name: f.name, parent: f.parent, child: f.child};
	});

	const treeBuilder = new Tree();
	const treeOutput = treeBuilder.processTree(treeData);
	console.clear();
	console.log(treeOutput);

	mixedWatches.reset();
	mixedWatches.WatchAll(() => {
		console.table(
			mixedWatches._functions.map((f, i) => {
				return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
			}),
		);
	});
}

// Make the functions available in the global scope
window.demo_mixed_execution = demo_mixed_execution;
// document['mixedWatches'] = mixedWatches;
