import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {Group, sleep, version} from 'http://127.0.0.1:5500/dist/async-monitor.esm.js';

const serialWatches = new Group();

const function_to_watch1 = () => sleep(1, /*fail:*/ false);
const function_to_watch2 = () => sleep(2, /*fail:*/ true);
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

function demo_serial_execution() {
	console.clear();
	console.log('serial execution:');
	console.log(`---> function_to_watch1: ${function_to_watch1.toString()}`);
	console.log('   |');
	console.log(`   ---> function_to_watch2: ${function_to_watch2.toString()}`);
	console.log('      |');
	console.log(`      ---> function_to_watch3: ${function_to_watch3.toString()}`);
	const treeData = serialWatches._functions.map(f => {
		return {name: f.name, parent: f.parent, child: f.child};
	});
	const treeBuilder = new Tree();
	const treeOutput = treeBuilder.processTree(data);
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
