// import {Monitor, Group, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
import {Monitor, Group, sleep, version} from 'http://127.0.0.1:5500/dist/async-monitor.esm.js';

console.log(`version: ${version}`);
console.log('');

const serialWatches = new Group();
const parallelWatches = new Group();

const function_to_watch1 = () => sleep(5, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ false);
const function_to_watch3 = () => sleep(3, /*fail:*/ false);

serialWatches.addWatch({
	parent: undefined,
	child: 'a',
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 1');
	},
});

serialWatches.addWatch({
	parent: 'a',
	child: 'b',
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 2');
	},
});

serialWatches.addWatch({
	parent: 'b',
	child: undefined,
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 3');
	},
});

parallelWatches.addWatch({
	parent: undefined,
	child: undefined,
	f: function_to_watch1,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 1');
	},
});

parallelWatches.addWatch({
	parent: undefined,
	child: undefined,
	f: function_to_watch2,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 2');
	},
});

parallelWatches.addWatch({
	parent: undefined,
	child: undefined,
	f: function_to_watch3,
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 3');
	},
});
// debugger;
function demo_serial_execution() {
	console.clear();
	console.log('serial execution:');
	console.log(`--->${function_to_watch1.toString()}`);
	console.log('   |');
	console.log('   --->' + function_to_watch2.toString());
	console.log('      |');
	console.log('      --->' + function_to_watch3.toString());
	serialWatches.WatchAll();
}
function demo_parallel_execution() {
	console.clear();
	console.log('parallel execution:');
	console.log(`--->${function_to_watch1.toString()}`);
	console.log(`--->${function_to_watch2.toString()}`);
	console.log(`--->${function_to_watch3.toString()}`);
	parallelWatches.WatchAll();
}
// Make the functions available in the global scope
window.demo_serial_execution = demo_serial_execution;
window.demo_parallel_execution = demo_parallel_execution;
