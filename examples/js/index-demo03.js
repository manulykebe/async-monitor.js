// https://www.npmjs.com/package/async-monitor.js

const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, sleep} = module;
	const demo03 = new Group();
	const logger = demo03.logger;
	demo03.addWatch({
		name: 'preparation step',
		parent: undefined,
		child: 'a',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
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
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			console.log('++++onStartCallback("publish snowflake s3")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("publish snowflake s3")');
		},
	});

	demo03.onStartCallback = function () {
		const button = document.getElementById('demo03');
		button.disabled = false;
		button.innerText = 'onStart';
	};
	demo03.onCompleteCallback = function () {
		const button = document.getElementById('demo03');
		button.disabled = false;
		button.innerText = 'onComplete';
		logger.log('All done!');
	};
	demo03.onRejectCallback = function () {
		const button = document.getElementById('demo03');
		button.disabled = false;
		button.innerText = 'onReject';
	};
	demo03.onAbortCallback = function () {
		const button = document.getElementById('demo03');
		button.disabled = false;
		button.innerText = 'onAbort';
	};

	function demo_demo03() {
		demo03.reset();
		demo03.watchAll();
	}

	// Make the functions available in the global scope
	window.demo_demo03 = demo_demo03;
	document['demo03'] = demo03;
};
importModule();
