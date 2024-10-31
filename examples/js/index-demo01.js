// https://www.npmjs.com/package/async-monitor.js
const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, Tree, sleep, version, logger} = module;

	const demo01 = new Group({repeat: 3});
	demo01.name = '3 paralle tasks, followed by a single task';
	const sample = 1;
	if (sample === 2) {
		demo01.addWatch(() => {
			return sleep(undefined, false);
		});
		demo01.addWatch(() => {
			return sleep(undefined, false);
		});
		demo01.addWatch(() => {
			return sleep(undefined, false);
		});
		demo01.addWatch(() => {
			return logger.log('yeddllo!');
		});
		demo01.addWatch(() => {
			return sleep(undefined, false);
		});
	}
	if (sample === 1) {
		demo01.addWatch({
			name: 'preparation step 01',
			parent: undefined,
			child: 'a',
			f: () => sleep(undefined, false),
			onStartCallback: function () {
				// logger.log('++++onStartCallback("preparation step")');
			},
			onCompleteCallback: function () {
				// logger.log('++++onCompleteCallback("preparation step")');
			},
			onRejectCallback: function () {
				logger.warn('++++onRejectCallback("preparation step")');
			},
			onAbortCallback: function () {
				logger.warn('++++onAbortCallback("preparation step")');
			},
		});

		demo01.addWatch({
			name: 'fetch data from ETL store: s1',
			parent: 'a',
			child: 'b',
			f: () => sleep(undefined, false),
			onStartCallback: function () {
				// logger.log('++++onStartCallback("fetch data from ETL store: s1")');
			},
			onCompleteCallback: function () {
				// logger.log('++++onCompleteCallback("fetch data from ETL store: s1")');
			},
			onRejectCallback: function () {
				logger.warn('++++onRejectCallback("fetch data from ETL store: s1")');
			},
		});

		demo01.addWatch({
			name: 'fetch data from ETL store: s2',
			parent: undefined,
			child: 'x',
			f: () => sleep(undefined, false),
			onStartCallback: function () {
				// logger.log('++++onStartCallback("fetch data from ETL store: s2")');
			},
			onCompleteCallback: function () {
				// logger.log('++++onCompleteCallback("fetch data from ETL store: s2")');
			},
			onRejectCallback: function () {
				logger.warn('++++onRejectCallback("fetch data from ETL store: s2")');
			},
		});

		demo01.addWatch({
			name: 'fetch data from ETL store: s3',
			parent: 'a',
			child: 'b',
			f: () => sleep(undefined, false),
			onStartCallback: function () {
				// logger.log('++++onStartCallback("fetch data from ETL store: s3")');
			},
			onCompleteCallback: function () {
				// logger.log('++++onCompleteCallback("fetch data from ETL store: s3")');
			},
		});

		demo01.addWatch({
			name: 'build snowflake',
			parent: 'b',
			f: () => sleep(undefined, false),
			onStartCallback: function () {
				// logger.log('++++onStartCallback("build snowflake")');
			},
			onCompleteCallback: function () {
				// logger.log('++++onCompleteCallback("build snowflake")');
			},
		});
	}

	demo01.onStartCallback = function () {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onStart';
	};
	demo01.onStartRunCallback = function () {
		logger.log(`this.run: ${this.run}`);
	};
	demo01.onCompleteCallback = function () {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onComplete';
	};
	demo01.onCompleteRunCallback = function () {
		logger.log(`this.run: ${this.run} - finished`);
		logger.log(this.metrics);
	};
	demo01.onRejectCallback = function () {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onReject';
		logger.log('GROUP ++++onRejectCallback("demo01")');
	};
	demo01.onAbortCallback = function () {
		const button = document.getElementById('demo01');
		button.disabled = false;
		button.innerText = 'onAbort';
		logger.warn('GROUP ++++onAbortCallback("demo01")');
	};

	function demo_demo01() {
		logger.clear();
		logger.log(demo01.loggerTree, ['tree', `tree-${demo01._id}`]);

		demo01.reset();
		demo01
			.watchAll()
			.then(() => {
				logger.log('++++onCompleteCallback("demo01")-> THEN');
			})
			.catch(() => {
				logger.log('++++onCompleteCallback("demo01")-> CATCH');
			})
			.finally(() => {
				logger.log('++++onCompleteCallback("demo01")-> FINALLY');
			});
	}

	// Make the functions available in the global scope
	window.demo_demo01 = demo_demo01;
	document['demo01'] = demo01;
};

importModule();
