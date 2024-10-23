// https://www.npmjs.com/package/async-monitor.js

const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, Tree, sleep, version} = module;
	// const demo02 = new Group({repeat: 7});
	const demo02 = new Group({repeat: 0});

	demo02.addWatch({
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

	demo02.onStartCallback = () => {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onStart';
	};
	demo02.onCompleteCallback = () => {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onComplete';
	};
	demo02.onRejectCallback = () => {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onReject';
	};
	demo02.onAbortCallback = () => {
		const button = document.getElementById('demo02');
		button.disabled = false;
		button.innerText = 'onAbort';
	};

	function demo_demo02() {
		console.clear();
		console.log(demo02.consoleTree, ['tree', `tree-${demo02._id}`]);

		demo02.reset();
		demo02.watchAll();
	}

	// Make the functions available in the global scope
	window.demo_demo02 = demo_demo02;
	document['demo02'] = demo02;
};
importModule();
