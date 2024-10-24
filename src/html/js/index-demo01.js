// https://www.npmjs.com/package/async-monitor.js
const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, Tree, sleep, version} = module;

	// const demo01 = new Group();
	const demo01 = new Group({repeat: 3});
	demo01.name = '3 paralle tasks, followed by a single task';

	demo01.addWatch({
		name: 'preparation step 01',
		parent: undefined,
		child: 'a',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			// console.log('++++onStartCallback("preparation step")');
		},
		onCompleteCallback: function () {
			// console.log('++++onCompleteCallback("preparation step")');
		},
	});

	demo01.addWatch({
		name: 'fetch data from ETL store: s1',
		parent: 'a',
		child: 'b',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			// console.log('++++onStartCallback("fetch data from ETL store: s1")');
		},
		onCompleteCallback: function () {
			// console.log('++++onCompleteCallback("fetch data from ETL store: s1")');
		},
		onRejectCallback: function () {
			console.warn('++++onRejectCallback("fetch data from ETL store: s1")');
		},
	});

	demo01.addWatch({
		name: 'fetch data from ETL store: s2',
		parent: 'a',
		child: 'b',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			// console.log('++++onStartCallback("fetch data from ETL store: s2")');
		},
		onCompleteCallback: function () {
			// console.log('++++onCompleteCallback("fetch data from ETL store: s2")');
		},
	});

	demo01.addWatch({
		name: 'fetch data from ETL store: s3',
		parent: 'a',
		child: 'b',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			// console.log('++++onStartCallback("fetch data from ETL store: s3")');
		},
		onCompleteCallback: function () {
			// console.log('++++onCompleteCallback("fetch data from ETL store: s3")');
		},
	});

	demo01.addWatch({
		name: 'build snowflake',
		parent: 'b',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			// console.log('++++onStartCallback("build snowflake")');
		},
		onCompleteCallback: function () {
			// console.log('++++onCompleteCallback("build snowflake")');
		},
	});

	demo01.onStartCallback = () => {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onStart';
	};
	demo01.onCompleteCallback = () => {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onComplete';
	};
	demo01.onRejectCallback = () => {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onReject';
	};
	demo01.onAbortCallback = () => {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onAbort';
	};

	function demo_demo01() {
		console.clear();
		console.log(demo01.consoleTree, ['tree', `tree-${demo01._id}`]);

		demo01.reset();
		demo01
			.WatchAll()
			.then(() => {
				console.log('++++onCompleteCallback("demo01")-> THEN');
			})
			.catch(() => {
				console.log('++++onCompleteCallback("demo01")-> CATCH');
			})
			.finally(() => {
				console.log('++++onCompleteCallback("demo01")-> FINALLY');
			});
	}

	// Make the functions available in the global scope
	window.demo_demo01 = demo_demo01;
	document['demo01'] = demo01;
};

importModule();
