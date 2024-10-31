// https://www.npmjs.com/package/async-monitor.js

const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, Tree, sleep, version, logger} = module;
	// const demo02 = new Group({repeat: 7});
	const demo02 = new Group({repeat: 0});
	demo02.name = '5 tasks in sequence';
	demo02.addWatch({
		name: 'preparation step',
		parent: undefined,
		child: 'a',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			logger.log('++++onStartCallback("preparation step")');
		},
		onCompleteCallback: function () {
			logger.log('++++onCompleteCallback("preparation step")');
		},
	});

	demo02.addWatch({
		name: 'fetch data from ETL store: s1',
		parent: 'a',
		child: 'b',
		// f: () => logger.log('not a promise'),
		f: () => sleep(undefined, false),
		onCompleteCallback: function () {
			logger.log('++++onCompleteCallback("fetch data from ETL store: s1")');
		},
	});

	demo02.addWatch({
		name: 'fetch data from ETL store: s2',
		parent: 'b',
		child: 'c',
		f: () => sleep(undefined, false),
		onCompleteCallback: function () {
			logger.log('++++onCompleteCallback("fetch data from ETL store: s2")');
		},
	});

	demo02.addWatch({
		name: 'fetch data from ETL store: s3',
		parent: 'c',
		child: 'd',
		f: () => sleep(undefined, false),
		onCompleteCallback: function () {
			logger.log('++++onCompleteCallback("fetch data from ETL store: s3")');
		},
	});

	demo02.addWatch({
		name: 'build snowflake',
		parent: 'd',
		f: () => sleep(undefined, false),
		onCompleteCallback: function () {
			logger.log('++++onCompleteCallback("build snowflake")');
		},
	});

	demo02.onStartCallback = function () {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onStart';
	};
	demo02.onCompleteCallback = function () {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onComplete';
		logger.log(this.metrics);
	};
	demo02.onRejectCallback = function () {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onReject';
	};
	demo02.onAbortCallback = function () {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onAbort';
	};

	function demo_demo02() {
		logger.clear();
		logger.log(demo02.loggerTree, ['tree', `tree-${demo02._id}`]);

		demo02.reset();
		demo02.watchAll();
	}

	// Make the functions available in the global scope
	window.demo_demo02 = demo_demo02;
	document['demo02'] = demo02;
};
importModule();
