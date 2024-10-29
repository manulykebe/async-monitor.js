/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
	testEnvironment: 'node',
	transform: {
		'^.+.tsx?$': ['ts-jest', {}],
	},
	collectCoverage: true,
	coverageReporters: ['lcov', 'text'],
	coverageDirectory: './coverage',
};
