import Tree from './Tree';

describe('Tree Structure Test', () => {
	test('Tree output should match the expected structure', () => {
		const data = [
			{name: 'start', parent: undefined, child: 'a'},
			{name: 'fetch data a', parent: 'a', child: 'b'},
			{name: 'make snow flake', parent: 'b', child: 3},
			{name: 'publish to s3', parent: 3, child: 'y'},
			{name: 'on s3', parent: 'y', child: 'final'},
			{name: 'grande finale', parent: 'final', child: undefined},
		];

		const expectedOutput = `── start
   └─ fetch data a
      └─ make snow flake
         └─ publish to s3
            └─ on s3
               └─ grande finale─┐
                                |
                                └─ completed`.trim();

		const treeBuilder = new Tree();
		const treeOutput = treeBuilder.processTree(data).trim();

		expect(treeOutput).toBe(expectedOutput);
	});
});
