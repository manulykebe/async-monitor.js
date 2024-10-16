import * as MONITOR from './Index';

describe('Monitor Group Class', () => {
	let group: MONITOR.Group;

	beforeEach(() => {
		// Create a new group before each test
		group = new MONITOR.Group();
	});

	it('should create a new group', () => {
		// Check if the group is created and is an instance of Monitor.Group
		expect(group).toBeInstanceOf(MONITOR.Group);
	});

	it('should add a watch function to the group', () => {
		// Define a mock function to watch
		const mockFunction = jest.fn();

		// Add the function to the group
		group.addWatch(mockFunction);

		// Check if the function has been added to the group
		expect(group._functions.length).toBe(1);
		expect(group._functions[0].f).toBe(mockFunction);
	});

	it('should reset the group and mark functions as unfinished', () => {
		// Add a mock function and set it as finished
		group.addWatch(jest.fn());
		group._functions[0]._isFinished = true;

		// Reset the group
		group.reset();

		// Ensure that all functions are marked as unfinished
		expect(group._functions[0]._isFinished).toBe(false);
		expect(group._isFinished).toBe(false);
	});

	it('should return all functions from the group', () => {
		// Add some mock functions
		group.addWatch(jest.fn());
		group.addWatch(jest.fn());

		// Get all functions from the group
		const functions = group.getAll();

		// Ensure that all functions have been returned
		expect(functions.length).toBe(2);
	});

	it('should remove all functions from the group', () => {
		// Add some mock functions
		group.addWatch(jest.fn());
		group.addWatch(jest.fn());

		// Remove all functions
		group.removeAll();

		// Ensure the group has no functions
		expect(group._functions.length).toBe(0);
	});

	it('should trigger onStart callback when starting the group', () => {
		const onStartCallback = jest.fn();
		group.onStart(onStartCallback);

		// Simulate starting the group
		group._onStartCallback();

		// Check that the callback was called
		expect(onStartCallback).toHaveBeenCalled();
	});

	it('should trigger onComplete callback when group is complete', () => {
		const onCompleteCallback = jest.fn();
		group.onComplete(onCompleteCallback);

		// Simulate completing the group
		group._onCompleteCallback();

		// Check that the callback was called
		expect(onCompleteCallback).toHaveBeenCalled();
	});

	it('should trigger onRejected callback when group is rejected', () => {
		const onRejectedCallback = jest.fn();
		group.onRejected(onRejectedCallback);

		// Simulate rejecting the group
		group._onRejectedCallback();

		// Check that the callback was called
		expect(onRejectedCallback).toHaveBeenCalled();
	});

	// it('should call Watch with correct arguments', () => {
	// 	const callback = jest.fn();
	// 	const callback_error = jest.fn();

	// 	// Call Watch with a callback and error callback
	// 	const result = group.Watch(callback, callback_error);

	// 	// Ensure it returns a Watch object
	// 	expect(result).toBeInstanceOf(MONITOR.Watch);
	// });

	//   it('should call WatchAll with correct arguments', () => {
	//     const callback = jest.fn();
	//     const callback_error = jest.fn();

	//     // Call WatchAll with a callback and error callback
	//     const result = group.WatchAll(callback, callback_error);

	//     // Ensure it returns the result of WatchAll
	//     expect(result).toBeDefined(); // Define behavior if needed
	//   });
});
