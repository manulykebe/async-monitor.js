interface TreeNode {
	name: string | number;
	description: string;
	children: TreeNode[];
}

interface TreeData {
	parent: string | number | undefined;
	child: string | number | undefined;
	name: string | undefined;
}

export default class Tree {
	private map: {[key: string]: TreeNode} = {};
	private roots: TreeNode[] = [];
	private consoleLogText: string = '';

	// Step 1: Build a tree structure from the array and combine nodes with the same parent-child relation
	private buildTree(arr: TreeData[]): TreeNode[] {
		arr.forEach(({parent, child, name}) => {
			// Ensure that 'child' is not undefined before using it as an index
			if (child !== undefined) {
				if (!this.map[child]) {
					this.map[child] = {
						name: child,
						description: name || String(child),
						children: [],
					};
				} else {
					if (name && !this.map[child].description.includes(name)) {
						this.map[child].description += `, ${name}`;
					}
				}
			}

			if (parent === undefined) {
				if (child !== undefined) {
					if (!this.map[child]) {
						this.map[child] = {
							name: child,
							description: name || String(child),
							children: [],
						};
					}
					this.roots.push(this.map[child]);
				}
			} else {
				if (!this.map[parent]) {
					this.map[parent] = {
						name: parent,
						description: String(parent),
						children: [],
					};
				}

				if (child !== undefined) {
					const existingChild = this.map[parent].children.find(c => c.name === child);
					if (!existingChild) {
						this.map[parent].children.push(this.map[child]);
					}
				} else {
					if (!this.map[parent].children.some(c => c.description === name)) {
						this.map[parent].children.push({
							name: '',
							description: name || '',
							children: [],
						});
					}
				}
			}
		});

		return this.roots;
	}

	// Step 2: Collect all terminal nodes (nodes without children)
	private collectTerminalNodes(node: TreeNode, terminalNodes: TreeNode[] = []): TreeNode[] {
		if (node.children.length === 0) {
			terminalNodes.push(node);
		}
		node.children.forEach(child => this.collectTerminalNodes(child, terminalNodes));
		return terminalNodes;
	}

	// Step 3: Function to calculate the longest line length (dry run without output)
	private calculateMaxLength(
		node: TreeNode,
		prefix: string = '',
		isLast: boolean = true,
		maxLengthObj = {maxLength: 0},
	): void {
		const line = `${prefix}${isLast ? '└─' : '├─'} ${node.description}`;

		// Calculate the longest line length during this dry run
		if (line.length > maxLengthObj.maxLength) {
			maxLengthObj.maxLength = line.length;
		}

		const newPrefix = prefix + (isLast ? '   ' : '│  ');

		node.children.forEach((child, index) => {
			const isLastChild = index === node.children.length - 1;
			this.calculateMaxLength(child, newPrefix, isLastChild, maxLengthObj);
		});
	}

	// Step 4: Function to display the tree and include longest line length at terminal nodes
	private displayTreeWithLineLength(
		node: TreeNode,
		prefix: string = '',
		isLast: boolean = true,
		terminalIndex: {current: number; total: number},
		maxLength: number,
		encounteredTerminalRef: {value: boolean},
	): void {
		const isTerminal = node.children.length === 0;
		let terminalLabel = '';
		let line = `${prefix}${isLast ? '└─' : '├─'} ${node.description}`;

		if (isTerminal) {
			const index = terminalIndex.current++;
			terminalLabel = index === 0 ? '─┐' : '─┤';

			// Pad terminal lines with '─'
			const paddingNeeded = maxLength - (line.length + terminalLabel.length);
			if (paddingNeeded > 0) {
				line += ' ' + '─'.repeat(paddingNeeded);
			}
			line += terminalLabel;

			encounteredTerminalRef.value = true; // Set the flag to true once a terminal node is encountered
		} else {
			// Pad non-terminal lines with dots and check if it appears after a terminal node
			const paddingNeeded = maxLength - line.length;
			if (paddingNeeded > 0) {
				line += ' '.repeat(paddingNeeded);
			}
			if (encounteredTerminalRef.value) {
				line += '│'; // Pad non-terminal nodes that appear after the first terminal node with '│'
			}
		}

		this.consoleLogText += line.trimEnd() + '\r\n';

		const newPrefix = prefix + (isLast ? '   ' : '│  ');

		node.children.forEach((child, index) => {
			const isLastChild = index === node.children.length - 1;
			this.displayTreeWithLineLength(child, newPrefix, isLastChild, terminalIndex, maxLength, encounteredTerminalRef);
		});
	}

	// Method to initiate the tree processing and display
	processTree(data: TreeData[]): string {
		// Step 1: Build tree
		const tree = this.buildTree(data);

		// Step 2: Dry run to calculate the longest line
		const maxLengthObj = {maxLength: 0};
		tree.forEach(root => this.calculateMaxLength(root, '', true, maxLengthObj));

		// Step 3: Track terminal node indices
		const terminalNodes: TreeNode[] = [];
		tree.forEach(root => this.collectTerminalNodes(root, terminalNodes));
		const terminalIndex = {current: 0, total: terminalNodes.length};

		// Step 4: Track whether we've encountered a terminal node
		const encounteredTerminalRef = {value: false};

		// Step 5: Display the tree with the longest line length added to terminal nodes and padded
		tree.forEach(root =>
			this.displayTreeWithLineLength(root, '', true, terminalIndex, maxLengthObj.maxLength, encounteredTerminalRef),
		);

		// Step 6: Add final completion line
		this.consoleLogText += ' '.repeat(maxLengthObj.maxLength) + '└─ completed';

		// Return the console output as string
		return this.consoleLogText;
	}
}

// Example Usage
// const data: TreeData[] = [
// 	{name: undefined, parent: undefined, child: 'a'},
// 	{name: 'fetch data a', parent: 'a', child: 'b'},
// 	{name: 'fetch data b', parent: 'a', child: 'b'},
// 	{name: 'make snow flake', parent: 'b', child: 3},
// 	{name: 'publish to s3', parent: 3, child: 'y'},
// 	{name: 'publish to s4', parent: 3, child: undefined},
// 	{name: 'do quality check', parent: 'b', child: 'd'},
// 	{name: 'on s3', parent: 'd', child: 'z'},
// ];

// Usage:
// const treeBuilder = new Tree();
// const treeOutput = treeBuilder.processTree(data);
// console.log(treeOutput);
