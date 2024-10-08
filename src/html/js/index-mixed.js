import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const mixedWatches = new Group();

mixedWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: () => sleep(undefined, false),
	onStartCallback: function () {
		const button = document.getElementById('demo03');
		button.disabled = true;
		button.innerText = 'Executing...';
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'a',
	child: 'b',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake',
	parent: 'b',
	child: 'c',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s1 & s2")');
	},
});

mixedWatches.addWatch({
	name: 'publish snowflake',
	parent: 'c',
	child: undefined,
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("publish snowflake")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'a',
	child: 'd',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake',
	parent: 'd',
	child: 'e',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s3")');
	},
});

mixedWatches.addWatch({
	name: 'publish snowflake',
	parent: 'e',
	child: 'f',
	f: () => sleep(undefined, false),
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
	mixedWatches.WatchAll(
		() => {
			const button = document.getElementById('demo03');
			button.disabled = false;
			button.innerText = 'Mixed Execution';
			console.table(
				mixedWatches._functions.map((f, i) => {
					return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
				}),
			);
		},
		() => {
			const button = document.getElementById('demo03');
			button.disabled = false;
			button.innerText = 'Mixed Execution (aborted)';
			console.table(
				mixedWatches._functions.map((f, i) => {
					return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
				}),
			);
		},
	);
}

// Make the functions available in the global scope
window.demo_mixed_execution = demo_mixed_execution;
document['mixedWatches'] = mixedWatches;
