// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const mixedWatches = new Group();

mixedWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: () => sleep(5, false),
	onStartCallback: function () {
		const button = document.getElementById('demo03');
		button.disabled = true;
		button.innerText = 'Executing...';
		console.log('++++onStartCallback("preparation step")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: () => sleep(5, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s1")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'a',
	child: 'b',
	f: () => sleep(10, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s2")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake s1 and s2',
	parent: 'b',
	child: 'c',
	f: () => sleep(5, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("build snowflake from s1 and s2")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s1 and s2")');
	},
});

mixedWatches.addWatch({
	name: 'publish snowflake s1 and s2',
	parent: 'c',
	child: 'x',
	f: () => sleep(5, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("publish snowflake s1 and s2")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("publish snowflake s1 and s2")');
	},
});

mixedWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'a',
	child: 'd',
	f: () => sleep(7, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s3")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

mixedWatches.addWatch({
	name: 'build snowflake from s3',
	parent: 'd',
	child: 'e',
	f: () => sleep(7, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("build snowflake from s3")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake from s3")');
	},
});

mixedWatches.addWatch({
	name: 'publish snowflake s3',
	parent: 'e',
	child: 'f',
	f: () => sleep(7, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("publish snowflake s3")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("publish snowflake s3")');
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
			console.log('Metrics:');
			console.table(mixedWatches.metrics);
		},
		() => {
			const button = document.getElementById('demo03');
			button.disabled = false;
			button.innerText = 'Mixed Execution (aborted)';
			console.log('Metrics:');
			console.table(mixedWatches.metrics);
		},
	);
}

// Make the functions available in the global scope
window.demo_mixed_execution = demo_mixed_execution;
document['mixedWatches'] = mixedWatches;
