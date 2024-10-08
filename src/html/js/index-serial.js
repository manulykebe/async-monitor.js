// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const serialWatches = new Group();

serialWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: () => sleep(undefined, false),
	onStartCallback: function () {
		const button = document.getElementById('demo02');
		button.disabled = true;
		button.innerText = 'Executing...';
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	// f: () => console.log('not a promise'),
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'b',
	child: 'c',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

serialWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'c',
	child: 'd',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

serialWatches.addWatch({
	name: 'build snowflake',
	parent: 'd',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake")');
	},
});

function demo_serial_execution() {
	console.clear();
	console.log(serialWatches.consoleTree);

	serialWatches.reset();
	serialWatches.WatchAll(
		() => {
			const button = document.getElementById('demo02');
			button.disabled = false;
			button.innerText = 'Serial Execution';
			console.table(
				serialWatches._functions.map((f, i) => {
					return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
				}),
			);
		},
		() => {
			const button = document.getElementById('demo02');
			button.disabled = false;
			button.innerText = 'Serial Execution (aborted)';
			console.log('Metrics:');
			console.table(parallelWatches.metrics);
		},
	);
}

// Make the functions available in the global scope
window.demo_serial_execution = demo_serial_execution;
document['serialWatches'] = serialWatches;
