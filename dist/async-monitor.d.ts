declare global {
    interface Console {
        highlight(text: string, _id: number, className?: string): void;
    }
}

/**
 * Pauses execution for a specified number of seconds, with an option to abort using AbortController.
 * If the `fail` parameter is not provided, it defaults to a random rejection based on the `seconds` value.
 *
 * @param seconds - The number of seconds to sleep (when set to 'undefined' a random timer between 0 and 3 seconds is set).
 * @param fail - Optional. If `true`, the promise will reject after the specified time. If `false`, it will resolve. If `undefined`, it will randomly reject based on the `seconds` value.
 * @returns A promise that resolves after the specified number of seconds, rejects based on the `fail` condition, or aborts if the signal is triggered.
 *
 * @example
 * const sleepPromise = sleep(2, false);
 * sleepPromise
 *   .then((result) => console.log(`Resolved after ${result / 1000} seconds`))
 *   .catch((error) => console.error(error.message));
 *
 * // Abort the sleep after 1 second
 * setTimeout(() => {
 *   sleepPromise.abort();
 * }, 1000);
 */
declare function sleep(seconds?: number, fail?: boolean | undefined): Promise<number>;

declare class Watch {
    constructor(fs: Array<{
        promise: Promise<any> | void;
        onRejectCallback?: (reason: any) => void;
        group?: Group;
    }>, f: (() => void) | Array<() => void>, fr?: () => void);
}

type Metric = {
    id: number;
    name: string;
    start: number | undefined;
    duration: number | undefined;
    isRunning: boolean;
    isFinished: boolean;
    isRejected: boolean;
    isAborted: boolean;
    sequence: number;
};
declare class WatchFunction {
    private _id;
    get id(): number;
    private _isAborted;
    get isAborted(): boolean;
    private _isFinished;
    get isFinished(): boolean;
    private _isRejected;
    get isRejected(): boolean;
    private _isRunning;
    get isRunning(): boolean;
    private _index?;
    private _startTime;
    private _stopTime;
    private _duration;
    private abortController;
    abort: () => void;
    signal: AbortSignal;
    name: string;
    parent: string;
    child: string;
    group?: Group | undefined;
    f: () => Promise<any> | void;
    onStartCallback?: () => void;
    onCompleteCallback?: () => void;
    onRejectCallback?: () => void;
    onAbortCallback?: () => void;
    sequence: number;
    reset: () => void;
    'promise': Promise<any>;
    get metrics(): Metric;
    constructor(arg: {
        f: () => Promise<any> | void;
        name: string;
        parent: string;
        child: string;
        onStartCallback?: () => void;
        onCompleteCallback?: () => void;
        onRejectCallback?: () => void;
        onAbortCallback?: () => void;
    } | (() => Promise<any> | void), name?: string, parent?: string, child?: string, onStartCallback?: () => void, onCompleteCallback?: () => void, onRejectCallback?: () => void, onAbortCallback?: () => void);
}

declare class Group {
    useConsoleLog: boolean;
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
    get _isRunning(): boolean;
    get _isFinished(): boolean;
    get _isRejected(): boolean;
    get _isAborted(): boolean;
    addWatch: (addWatchFunction: WatchFunction) => void;
    abortWatch(name: string): void;
    abort(): void;
    reset(): void;
    getAll(): Array<WatchFunction>;
    removeAll(): void;
    add(): void;
    remove(): void;
    Watch(callback: () => void, callback_error: () => void): Watch;
    WatchAll(callback?: () => void | undefined, callback_error?: () => void | undefined): Promise<void> | undefined;
    get consoleTree(): string;
    get metrics(): Metric[];
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

interface TreeData {
    parent: string | number | undefined;
    child: string | number | undefined;
    name: string | undefined;
}
declare class Tree {
    private map;
    private roots;
    private consoleLogText;
    private buildTree;
    private collectTerminalNodes;
    private calculateMaxLength;
    private displayTreeWithLineLength;
    processTree(data: TreeData[]): string;
}

declare class Monitor {
    private fs;
    constructor(fs: Promise<any>[]);
    monitorStatuses(): Promise<{
        performance: number;
        statusesPromise: Array<PromiseSettledResult<any>>;
    }>;
}

declare const version = "1.1.1";

declare const nextId: typeof Sequence.nextId;

declare const _default: {
    Group: typeof Group;
    now: () => number;
    Sequence: typeof Sequence;
    nextId: typeof Sequence.nextId;
    Monitor: typeof Monitor;
    version: string;
    Watch: typeof Watch;
    sleep: typeof sleep;
    Tree: typeof Tree;
    WatchFunction: typeof WatchFunction;
};

export { Group, Monitor, Sequence, Tree, Watch, WatchFunction, _default as default, nextId, now, sleep, version };
