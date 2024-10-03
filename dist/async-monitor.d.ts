/**
 * The sleep function pauses execution for a specified amount of time. Useful for testing purposes as it
 * has a random option when param fail is not set.
 *
 * @param seconds - The number of seconds (default is a random number between 0 and 3).
 * @param fail - Whether the function should reject or not (default is `false`).
 * @returns A promise that resolves after `seconds` seconds or rejects based on the `fail` condition.
 */
declare function sleep(seconds?: number, fail?: boolean | undefined): Promise<number>;

declare class Watch {
    constructor(fs: Array<{
        promise: Promise<any> | void;
        onRejectCallback?: (reason: any) => void;
        group?: Group;
    }>, f: (() => void) | Array<() => void>, fr?: () => void);
}

interface WatchFunction {
    parent?: string | undefined;
    child?: string | undefined;
    group?: Group | undefined;
    sequence?: number | undefined;
    promise?: Promise<any> | void;
    f: () => void;
    onStartCallback?: (() => void) | undefined;
    onCompleteCallback?: (() => void) | undefined;
    onRejectCallback?: (() => void) | undefined;
    _isRunning?: boolean;
    _isFinished?: boolean;
    _index?: number | undefined;
    _startTime: number;
    _stopTime: number;
    _duration: number;
}
declare class Group {
    _id: number;
    _functions: WatchFunction[];
    _startTime: number;
    _stopTime: number;
    _duration: number;
    _seq: number;
    __callback?: () => void | undefined;
    __callback_error?: () => void | undefined;
    _onStartCallback: () => void;
    _onCompleteCallback: () => void;
    _onUnCompleteCallback: () => void;
    _onRejectedCallback: () => void;
    _abort: AbortController;
    get _isRunning(): boolean;
    get _isFinished(): boolean;
    addWatch: (addWatchFunction: WatchFunction | (() => void)) => void;
    abort(): void;
    reset(): void;
    getAll(): Array<WatchFunction>;
    removeAll(): void;
    add(): void;
    remove(): void;
    Watch(callback: () => void, callback_error: () => void): Watch;
    WatchAll(callback?: () => void | undefined, callback_error?: () => void | undefined): void;
    onRejected(callback: () => void): this;
    onStart(callback: () => void): this;
    onComplete(callback: () => void): this;
}

declare const now: () => number;

/**
 * Sequence
 *
 * A utility class that provides sequential unique IDs.
 * It maintains a static counter that increments with each call to `nextId()`,
 * ensuring that each ID is unique within the runtime of the application.
 */
declare class Sequence {
    private static _nextId;
    static nextId(): number;
}

declare class Monitor {
    private fs;
    constructor(fs: Promise<any>[]);
    monitorStatuses(): Promise<{
        performance: number;
        statusesPromise: Array<PromiseSettledResult<any>>;
    }>;
}

declare const version = "1.0.5";

declare const nextId: typeof Sequence.nextId;
declare const getAll: () => Array<WatchFunction>;
declare const removeAll: () => void;
declare const add: () => void;
declare const remove: () => void;

declare const _default: {
    Group: typeof Group;
    now: () => number;
    Sequence: typeof Sequence;
    nextId: typeof Sequence.nextId;
    Monitor: typeof Monitor;
    version: string;
    getAll: () => Array<WatchFunction>;
    removeAll: () => void;
    add: () => void;
    remove: () => void;
    Watch: typeof Watch;
    sleep: typeof sleep;
};

export { Group, Monitor, Sequence, Watch, type WatchFunction, add, _default as default, getAll, nextId, now, remove, removeAll, sleep, version };
