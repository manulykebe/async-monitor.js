// import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const parallelWatches = new Group();

parallelWatches.addWatch({
	name: 'preparation step',
	parent: undefined,
	child: 'a',
	f: () => sleep(undefined, false),
	onStartCallback: function () {
		const button = document.getElementById('demo01');
		button.disabled = true;
		button.innerText = 'Executing...';
	},
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("preparation step")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'a',
	child: 'b',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

parallelWatches.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'a',
	child: 'b',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

parallelWatches.addWatch({
	name: 'build snowflake',
	parent: 'b',
	f: () => sleep(undefined, false),
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
			console.table(
				parallelWatches._functions.map((f, i) => {
					return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
				}),
			);
		},
		() => {
			const button = document.getElementById('demo01');
			button.disabled = false;
			button.innerText = 'Parallel Execution (aborted)';
			console.table(
				parallelWatches._functions.map((f, i) => {
					return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
				}),
			);
		},
	);
}

// Make the functions available in the global scope
window.demo_parallel_execution = demo_parallel_execution;
document['parallelWatches'] = parallelWatches;
