// https://www.npmjs.com/package/async-monitor.js

import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const demo02 = new Group();

demo02.addWatch({
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

demo02.addWatch({
	name: 'fetch data from ETL store: s1',
	parent: 'a',
	child: 'b',
	// f: () => console.log('not a promise'),
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
	},
});

demo02.addWatch({
	name: 'fetch data from ETL store: s2',
	parent: 'b',
	child: 'c',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
	},
});

demo02.addWatch({
	name: 'fetch data from ETL store: s3',
	parent: 'c',
	child: 'd',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
	},
});

demo02.addWatch({
	name: 'build snowflake',
	parent: 'd',
	f: () => sleep(undefined, false),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback("build snowflake")');
	},
});

function demo_demo02() {
	console.clear();
	console.log(demo02.consoleTree, `tree-${demo02._id}`);

	demo02.reset();
	demo02.WatchAll(
		() => {
			const button = document.getElementById('demo02');
			button.disabled = false;
			button.innerText = 'demo02';
			console.log('Metrics:');
			console.table(demo02.metrics);
		},
		() => {
			const button = document.getElementById('demo02');
			button.disabled = false;
			button.innerText = 'demo02 (aborted)';
			console.log('Metrics:');
			console.table(demo02.metrics);
		},
	);
}

// Make the functions available in the global scope
window.demo_demo02 = demo_demo02;
document['demo02'] = demo02;