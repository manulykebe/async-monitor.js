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

interface TreeOptions {
	repeat?: number; // Optional parameter for the repeat count
}

interface TreeOptionsRepeat {
	repeat: number;
	current: number;
}

export default class Tree {
	private map: {[key: string]: TreeNode} = {};
	private roots: TreeNode[] = [];
	private consoleLogText: string = '';
	private repeatOptions: TreeOptionsRepeat = {repeat: 0, current: 0};
	// repeater not in use by default, -1 is infinite, >0 is number of loops
	constructor(options: TreeOptions = {}) {
		this.repeatOptions.repeat = options.repeat ?? 0;
	}

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
		isFirst: boolean = true,
		isFirstRoot: boolean = true,
		isLast: boolean = true,
		maxLengthObj = {maxLength: 0},
	): void {
		let repeatIndicator = ' ';
		let repeatIndicatorFirstLine = '─';
		let terminalLabel = '';

		if (this.repeatOptions.repeat != 0) {
			repeatIndicator = ' │';
			repeatIndicatorFirstLine = isFirst ? (isFirstRoot ? '┬─' : '┼─') : '─';
		}

		const line = `${isFirst ? '─' + repeatIndicatorFirstLine + '─' : repeatIndicator + prefix + (isLast && !isFirst ? '└─' : '├─')} ${node.description}`;

		// Calculate the longest line length during this dry run
		if (line.length > maxLengthObj.maxLength) {
			maxLengthObj.maxLength = line.length;
		}

		const newPrefix = prefix + (isLast ? '    ' : ' │  ');

		node.children.forEach((child, index) => {
			const isLastChild = index === node.children.length - 1;
			this.calculateMaxLength(child, newPrefix, false, isFirstRoot, isLastChild, maxLengthObj);
		});
	}

	// Step 4: Function to display the tree and include longest line length at terminal nodes
	private displayTreeWithLineLength(
		node: TreeNode,
		prefix: string = '',
		isFirst: boolean = true,
		isFirstRoot: boolean = false,
		isLast: boolean = true,
		terminalIndex: {current: number; total: number},
		maxLength: number,
		encounteredTerminalRef: {value: boolean},
	): void {
		const isTerminal = node.children.length === 0;
		let repeatIndicator = ' ';
		let repeatIndicatorFirstLine = '─';
		let terminalLabel = '';

		if (this.repeatOptions.repeat != 0) {
			repeatIndicator = ' │';
			repeatIndicatorFirstLine = isFirst ? (isFirstRoot ? '┬─' : '┼─') : '─';
		}

		let line = `${isFirst ? '─' + repeatIndicatorFirstLine + '─' : repeatIndicator + prefix + (isLast && !isFirst ? '└─' : '├─')} ${node.description}`;

		if (isTerminal) {
			const index = terminalIndex.current++;
			terminalLabel = index === 0 ? '─┐' : '─┤';

			// Pad terminal lines with '─'
			const paddingNeeded = maxLength - (line.length + terminalLabel.length);
			if (paddingNeeded > 0) {
				line += '─'.repeat(paddingNeeded + 1);
			}
			line += '─' + terminalLabel;

			encounteredTerminalRef.value = true; // Set the flag to true once a terminal node is encountered
		} else {
			// Pad non-terminal lines with spaces and check if it appears after a terminal node
			const paddingNeeded = maxLength - line.length;
			if (paddingNeeded > 0) {
				line += ' '.repeat(paddingNeeded + 1);
			}
			if (encounteredTerminalRef.value) {
				line += '│'; // Pad non-terminal nodes that appear after the first terminal node with '│'
			}
		}

		this.consoleLogText += line.trimEnd() + '\r\n';

		const newPrefix = prefix + (isLast ? '   ' : '│  ');

		node.children.forEach((child, index) => {
			const isLastChild = index === node.children.length - 1;
			this.displayTreeWithLineLength(
				child,
				newPrefix,
				false,
				isFirstRoot,
				isLastChild,
				terminalIndex,
				maxLength,
				encounteredTerminalRef,
			);
		});
	}

	// Method to initiate the tree processing and display
	processTree(data: TreeData[]): string {
		// Step 1: Build tree
		const tree = this.buildTree(data);

		// Step 2: Dry run to calculate the longest line
		const maxLengthObj = {maxLength: 0};
		tree.forEach(root => this.calculateMaxLength(root, '', true, false, true, maxLengthObj));

		// Step 3: Track terminal node indices
		const terminalNodes: TreeNode[] = [];
		tree.forEach(root => this.collectTerminalNodes(root, terminalNodes));
		const terminalIndex = {current: 0, total: terminalNodes.length};

		// Step 4: Track whether we've encountered a terminal node
		const encounteredTerminalRef = {value: false};

		// Step 5: Display the tree with the longest line length added to terminal nodes and padded
		tree.forEach((root, indx) =>
			this.displayTreeWithLineLength(
				root,
				'',
				true,
				indx === 0,
				true,
				terminalIndex,
				maxLengthObj.maxLength,
				encounteredTerminalRef,
			),
		);

		// Step 6: Add final completion line
		if (this.repeatOptions.repeat != 0) {
			const repeatText =
				this.repeatOptions.repeat == -1
					? ' ∞ '
					: ' '.repeat(String(this.repeatOptions.repeat).length) + '1/' + this.repeatOptions.repeat + ' ';
			this.consoleLogText +=
				' └' + repeatText + '─'.repeat(Math.max(1, maxLengthObj.maxLength - repeatText.length - 1)) + '┤\r\n';
		}
		this.consoleLogText += ' '.repeat(maxLengthObj.maxLength + 1) + '└─ completed';

		return this.consoleLogText;
	}
}

/*
Corner and Tee Shapes:

└ (Box Drawings Light Up and Right)
┘ (Box Drawings Light Up and Left)
┌ (Box Drawings Light Down and Right)
┐ (Box Drawings Light Down and Left)
├ (Box Drawings Light Vertical and Right)
┤ (Box Drawings Light Vertical and Left)
┬ (Box Drawings Light Down and Horizontal)
┴ (Box Drawings Light Up and Horizontal)
┼ (Box Drawings Light Vertical and Horizontal)

*/
