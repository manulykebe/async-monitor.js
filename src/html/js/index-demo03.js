// https://www.npmjs.com/package/async-monitor.js

import {Group, Tree, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';
// import {Group, Tree, sleep, version} from '/dist/async-monitor.esm.js';

const demo03 = new Group();

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

demo03.addWatch({
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

function demo_demo03() {
	console.clear();
	console.log(demo03.consoleTree, `tree-${demo03._id}`);

	demo03.reset();
	demo03.WatchAll(
		() => {
			const button = document.getElementById('demo03');
			button.disabled = false;
			button.innerText = 'demo03';
			console.log('Metrics:');
			console.table(demo03.metrics);
		},
		() => {
			const button = document.getElementById('demo03');
			button.disabled = false;
			button.innerText = 'demo03 (aborted)';
			console.log('Metrics:');
			console.table(demo03.metrics);
		},
	);
}

// Make the functions available in the global scope
window.demo_demo03 = demo_demo03;
document['demo03'] = demo03;