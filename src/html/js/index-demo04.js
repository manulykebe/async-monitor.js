// https://www.npmjs.com/package/async-monitor.js

const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {makeAsync, Group, Tree, sleep, version} = module;
	const demo04 = new Group();
	const demo05 = new Group();
	demo04.useConsoleLog = true;
	demo05.useConsoleLog = true;

	demo04.addWatch({
		name: 'preparation step',
		parent: undefined,
		child: 'a',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			const button = document.getElementById('demo04');
			button.disabled = true;
			button.innerText = 'Executing...';
			console.log('++++onStartCallback("preparation step")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("preparation step")');
		},
	});

	demo04.addWatch({
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

	demo04.addWatch({
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

	demo04.addWatch({
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

	demo04.addWatch({
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

	demo04.addWatch({
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

	demo04.addWatch({
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

	demo04.addWatch({
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

	const wrapped01 = () =>
		new Promise((resolve, reject) => {
			document['demo01'].WatchAll(
				() => resolve(),
				() => reject(),
			);
		});
	const wrapped02 = () =>
		new Promise((resolve, reject) => {
			document['demo02'].WatchAll(
				() => resolve(),
				() => reject(),
			);
		});
	const wrapped03 = () =>
		new Promise((resolve, reject) => {
			document['demo03'].WatchAll(
				() => resolve(),
				() => reject(),
			);
		});
	const wrapped04 = () =>
		new Promise((resolve, reject) => {
			demo04.WatchAll(
				() => resolve(),
				() => reject(),
			);
		});
	// const wrapped04 = makeAsync(() =>
	// 	demo04.WatchAll(
	// 		() => {},
	// 		() => {},
	// 	)()
	// );

	demo05.addWatch({
		name: 'demo05 initiator',
		parent: undefined,
		child: 'a',
		f: () => sleep(undefined, false),
		onStartCallback: function () {
			console.log('++++onStartCallback("demo05 initiator")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("demo05 initiator")');
		},
	});
	demo05.addWatch({
		name: 'wrapped demo01.WatchAll',
		parent: 'a',
		child: 'b',
		f: () => wrapped01(),
		onStartCallback: function () {
			console.log('++++onStartCallback("wrapped document[demo01].WatchAll")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("wrapped document[demo01].WatchAll")');
		},
	});
	demo05.addWatch({
		name: 'wrapped demo02.WatchAll',
		parent: 'b',
		child: 'c',
		f: () => wrapped02(),
		onStartCallback: function () {
			console.log('++++onStartCallback("wrapped document[demo02].WatchAll")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("wrapped document[demo02].WatchAll")');
		},
	});
	demo05.addWatch({
		name: 'wrapped demo03.WatchAll',
		parent: 'a',
		child: 'b',
		f: () => wrapped03(),
		onStartCallback: function () {
			console.log('++++onStartCallback("wrapped document[demo03].WatchAll")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("wrapped document[demo03].WatchAll")');
		},
	});
	demo05.addWatch({
		name: 'wrapped demo04.WatchAll',
		parent: 'b',
		child: 'd',
		f: () => wrapped04(),
		onStartCallback: function () {
			console.log('++++onStartCallback("wrapped demo04.WatchAll")');
		},
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback("wrapped demo04.WatchAll")');
		},
	});

	function demo_demo04() {
		console.clear();
		console.log(demo05.consoleTree, ['tree', `tree-${demo05._id}`]);
		console.log(document['demo01'].consoleTree, `tree-${document['demo01']._id}`);
		console.log(document['demo02'].consoleTree, `tree-${document['demo02']._id}`);
		console.log(document['demo03'].consoleTree, `tree-${document['demo03']._id}`);
		console.log(demo04.consoleTree, ['tree', `tree-${demo04._id}`]);

		document['demo01'].reset();
		document['demo02'].reset();
		document['demo03'].reset();
		demo04.reset();
		demo05.reset();
		demo05.WatchAll(
			() => {
				['demo01', 'demo02', 'demo03', 'demo04'].forEach(key => {
					const button = document.getElementById(key);
					button.disabled = false;
					button.innerText = key;
				});
				console.table(demo05.metrics);
			},
			() => {
				['demo01', 'demo02', 'demo03', 'demo04'].forEach(key => {
					const button = document.getElementById(key);
					button.disabled = false;
					button.innerText = key;
				});
				console.table(demo05.metrics);
			},
		);
	}

	// Make the functions available in the global scope
	window.demo_demo04 = demo_demo04;
	document['demo04'] = demo04;
};
importModule();
