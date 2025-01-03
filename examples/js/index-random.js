function generateRandomSentence() {
	const subjects = [
		'The pipeline',
		'A scheduled job',
		'Data ingestion',
		'The ETL process',
		'A transformation task',
		'The data warehouse',
		'A SQL query',
		'The data loader',
		'An API request',
		'The batch process',
	];

	const verbs = [
		'extracts',
		'transforms',
		'loads',
		'aggregates',
		'validates',
		'processes',
		'migrates',
		'cleans',
		'joins',
		'filters',
	];

	const objects = [
		'customer records',
		'transaction data',
		'user logs',
		'real-time streams',
		'sales metrics',
		'JSON payloads',
		'database tables',
		'CSV files',
		'API responses',
		'event logs',
	];

	const additionalPhrases = [
		'on a daily basis.',
		'in real-time.',
		'for reporting purposes.',
		'using cloud services.',
		'with error handling.',
		'for data analysis.',
		'using incremental loads.',
		'from multiple sources.',
		'to ensure data quality.',
		'before loading into the warehouse.',
	];

	// Randomly pick one element from each array
	const subject = subjects[Math.floor(Math.random() * subjects.length)];
	const verb = verbs[Math.floor(Math.random() * verbs.length)];
	const object = objects[Math.floor(Math.random() * objects.length)];
	const additional = additionalPhrases[Math.floor(Math.random() * additionalPhrases.length)];

	// Construct and return the sentence
	return `${subject} ${verb} ${object} ${additional}`;
}

const importModule = async () => {
	let module;
	if (window.location.hostname === '127.0.0.1') {
		module = await import('/dist/async-monitor.min.esm.js');
	} else {
		module = await import('https://manulykebe.github.io/async-monitor.js/dist/async-monitor.min.esm.js');
	}

	const {Group, sleep} = module;

	function generateLetterSequence(startLetter, offset) {
		const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const base = letters.length;

		// Helper function to convert a number into a letter sequence
		function numberToLetters(num) {
			let sequence = '';
			while (num >= 0) {
				sequence = letters[num % base] + sequence;
				num = Math.floor(num / base) - 1;
			}
			return sequence;
		}

		const startIndex = letters.indexOf(startLetter);
		if (startIndex === -1) {
			throw new Error('Invalid start letter.');
		}

		return numberToLetters(startIndex + offset);
	}

	function buildTree(numberOfNodes, demo) {
		if (numberOfNodes < 1) {
			logger.error('Number of nodes should be at least 1');
			return;
		}

		const nodes = [];
		const parentChildMap = new Map(); // To track parents and their children
		let currentLetterIndex = 0;
		const startLetter = 'b';

		for (let i = 0; i < numberOfNodes; i++) {
			let parent;
			let childLetter = generateLetterSequence(startLetter, currentLetterIndex + 1);

			if (i > 0) {
				const parentNodeIndex = Math.floor(Math.random() * nodes.length);
				parent = nodes[parentNodeIndex].child;

				// Add to parent's children in the map
				if (!parentChildMap.has(parent)) {
					parentChildMap.set(parent, []);
				}
				parentChildMap.get(parent).push(childLetter);
			}

			// Create a new node
			const node = {
				name: generateRandomSentence() + ` (${generateUniqueDescription()})`,
				parent: parent, // The parent may be undefined for the first node
				child: i === numberOfNodes - 1 ? undefined : childLetter, // Last node has no child
				f: () => sleep(undefined, false),
				onStartCallback: function () {
					// logger.log(`++++onStartCallback("${this.name}")`);
				},
				onCompleteCallback: function () {
					// logger.log(`++++onCompleteCallback("${this.name}")`);
				},
			};
			demo.addWatch(node);
			nodes.push(node);
			currentLetterIndex++; // Move to next letter in the sequence
		}
		demo._functions
			.filter(f => f.child === undefined)
			.forEach(f => (f.child = generateLetterSequence(startLetter, currentLetterIndex + 1)));
		return nodes;
	}

	function generateUniqueDescription() {
		const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
		let result = '';
		for (let i = 0; i < 2; i++) {
			result += chars.charAt(Math.floor(Math.random() * chars.length));
		}
		return result;
	}

	const demo97 = new Group();
	const demo98 = new Group();
	const demo99 = new Group();
	buildTree(parseInt(Math.random() * 10 + 5), demo97);
	buildTree(parseInt(Math.random() * 10 + 5), demo98);
	buildTree(parseInt(Math.random() * 10 + 5), demo99);

	const wrapped97 = () => demo97.watchAll();
	const wrapped98 = () => demo98.watchAll();
	const wrapped99 = () => demo99.watchAll();

	const demo00 = new Group();
	demo00.addWatch({
		name: 'initiate',
		parent: undefined,
		child: 'a',
		f: () => sleep(0, false),
		onStartCallback: function () {},
		onCompleteCallback: function () {},
	});
	demo00.addWatch({
		name: 'wrapped demo97.watchAll',
		parent: 'a',
		child: 'b',
		f: () => wrapped97(),
		onStartCallback: function () {},
		onCompleteCallback: function () {},
	});
	demo00.addWatch({
		name: 'wrapped demo98.watchAll',
		parent: 'b',
		child: 'c',
		f: () => wrapped98(),
		onStartCallback: function () {},
		onCompleteCallback: function () {},
	});
	demo00.addWatch({
		name: 'wrapped demo99.watchAll',
		parent: 'c',
		child: 'd',
		f: () => wrapped99(),
		onStartCallback: function () {},
		onCompleteCallback: function () {},
	});
	const logger = demo00.logger;

	function demo_demo00() {
		logger.clear();
		demo00.reset();
		demo97.reset();
		demo98.reset();
		demo99.reset();
		logger.log(demo00.loggerTree, ['tree', `tree-${demo00._id}`]);
		logger.log(demo97.loggerTree, ['tree', `tree-${demo97._id}`]);
		logger.log(demo98.loggerTree, ['tree', `tree-${demo98._id}`]);
		logger.log(demo99.loggerTree, ['tree', `tree-${demo99._id}`]);
		demo00.watchAll(
			() => logger.log('All done!'),
			() => logger.log('Error!'),
		);
	}

	document['demo_demo00'] = demo_demo00;
};

importModule();
