/**
 * Sequence
 *
 * A utility class that provides sequential unique IDs.
 * It maintains a static counter that increments with each call to `nextId()`,
 * ensuring that each ID is unique within the runtime of the application.
 */
export default class Sequence {
	private static _nextId = 0;

	static nextId(): number {
		return Sequence._nextId++;
	}
}
