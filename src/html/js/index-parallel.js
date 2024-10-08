// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const parallelWatches = new Group();

parallelWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: () => sleep(1, false),
	onStartCallback: function () {
		const button = document.getElementById('demo01');
		button.disabled = true;
		button.innerText = 'Executing...';
		console.log('++++onStartCallback("preparation step")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: () => sleep(2, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s1")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'a',
	child: 'b',
	f: () => sleep(3, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s2")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'a',
	child: 'b',
	f: () => sleep(4, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("fetch data from ETL store: s3")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

parallelWatches.addWatch({
	name: 'build snowflake',
	parent: 'b',
	f: () => sleep(5, false),
	onStartCallback: function () {
		console.log('++++onStartCallback("build snowflake")');
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake")');
	},
});

function demo_parallel_execution() {
	console.clear();
	console.log(parallelWatches.consoleTree);

	parallelWatches.reset();
	parallelWatches.WatchAll(
		() => {
			const button = document.getElementById('demo01');
			button.disabled = false;
			button.innerText = 'Parallel Execution';
			console.log('Metrics:');
			console.table(parallelWatches.metrics);
		},
		() => {
			const button = document.getElementById('demo01');
			button.disabled = false;
			button.innerText = 'Parallel Execution (aborted)';
			console.log('Metrics:');
			console.table(parallelWatches.metrics);
		},
	);
}

// Make the functions available in the global scope
window.demo_parallel_execution = demo_parallel_execution;
document['parallelWatches'] = parallelWatches;
