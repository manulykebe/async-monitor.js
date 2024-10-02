import dts from 'rollup-plugin-dts';

export default [
	{
		input: '.tmp/Index.js',
		// https://github.com/rollup/rollup/wiki/Troubleshooting#this-is-undefined
		context: 'this',
		watch: {clearScreen: false},
		output: [
			{
				file: 'dist/async-monitor.umd.js',
				name: 'MONITOR',
				format: 'umd',
				exports: 'named',
			},
			{
				file: 'dist/async-monitor.amd.js',
				format: 'amd',
				exports: 'named',
			},
			{
				file: 'dist/async-monitor.cjs',
				format: 'cjs',
				exports: 'named',
			},
			{
				file: 'dist/async-monitor.esm.js',
				format: 'es',
				exports: 'named',
			},
		],
	},
	{
		input: '.tmp/tests.test.js',
		context: 'this',
		watch: {clearScreen: false},
		output: [
			{file: '.tmp/tests.test.cjs', format: 'cjs', exports: 'named'}, // For tests running in Node.js
			{file: '.tmp/tests.test.umd.js', format: 'umd', exports: 'named', name: 'MONITOR'}, // For the nodeunit.html tests in browser
		],
	},
	{
		input: './.tmp/Index.d.ts',
		watch: {clearScreen: false},
		output: [{file: 'dist/async-monitor.d.ts', format: 'es'}],
		plugins: [dts()],
	},
];
