import {Group, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {Group, sleep, version} from 'http://127.0.0.1:5500/dist/async-monitor.esm.js';

const parallelWatches = new Group();

const function_to_watch1 = () => sleep(1, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ false);
const function_to_watch3 = () => sleep(3, /*fail:*/ false);

parallelWatches.addWatch({
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 1');
	},
});

parallelWatches.addWatch({
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 2');
	},
});

parallelWatches.addWatch({
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 3');
	},
});

function demo_parallel_execution() {
	console.clear();
	console.log('parallel execution:');
	console.log(`|`);
	console.log(`|---> function_to_watch1: ${function_to_watch1.toString()}`);
	console.log(`|---> function_to_watch2: ${function_to_watch2.toString()}`);
	console.log(`|---> function_to_watch3: ${function_to_watch3.toString()}`);
	parallelWatches.reset();
	parallelWatches.WatchAll(() => {
		console.table(
			parallelWatches._functions.map((f, i) => {
				return {index: i, start: f._startTime - f.group._startTime, duration: f._duration, f: f.f.toString()};
			}),
		);
	});
}

// Make the functions available in the global scope
window.demo_parallel_execution = demo_parallel_execution;
