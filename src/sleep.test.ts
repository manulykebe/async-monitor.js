import * as MONITOR from './Index';

describe('sleep function', () => {
	const sleep = MONITOR.sleep;

	// Test that it resolves correctly with default parameters
	it('should resolve after a random amount of time', async () => {
		const result = await sleep();
		expect(result).toBeGreaterThanOrEqual(0); // Check if the result is a positive number
		expect(result).toBeLessThanOrEqual(3000); // Should be less than or equal to 3 seconds (3000 ms)
	});

	const repeatCount = 0; // Number of times to repeat the test
	it(
		'should resolve after a random amount of time (repeat test)',
		async () => {
			for (let i = 0; i < repeatCount; i++) {
				const result = await sleep();
				expect(result).toBeGreaterThanOrEqual(0); // Check if the result is a positive number
				expect(result).toBeLessThanOrEqual(3000); // Should be less than or equal to 3 seconds (3000 ms)
			}
		},
		repeatCount * 3000, //Increase timeout to accommodate longer test execution
	);

	// Test that it resolves correctly for a specific time
	it('should resolve after the specified time', async () => {
		const ms = 1; // 1 second
		const result = await sleep(ms, false); // Set fail to false to ensure it resolves
		expect(result).toBeCloseTo(1000); // 1 second is 1000 ms
	});

	// Test that it rejects correctly when fail is true
	it('should reject when fail is true', async () => {
		const ms = 1; // 1 second
		await expect(sleep(ms, true)).rejects.toBe(1000); // Should reject with 1000 ms
	});

	// Test the fail logic when fail is undefined and based on random ms
	it('should reject based on fail logic when fail is undefined', async () => {
		const ms = 0.2; // 200 ms
		await expect(sleep(ms)).rejects.toBe(200); // If ms*4 < 1, fail will be true, so it should reject
	});

	// Test that it resolves when fail is false, even if ms is small
	it('should resolve even with small ms when fail is false', async () => {
		const ms = 0.1; // 100 ms
		const result = await sleep(ms, false); // Explicitly set fail to false
		expect(result).toBe(100); // Should resolve with 100 ms
	});
});
