declare global {
    interface Console {
        highlight(text: string, _id: number, className?: string): void;
    }
}

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

type Metric = {
    index: number;
    name: string;
    start: number | undefined;
    duration: number | undefined;
    f: string;
    isRunning: boolean;
    isFinished: boolean;
    sequence: number;
};
interface WatchFunction {
    name: string;
    parent?: string | undefined;
    child?: string | undefined;
    group?: Group | undefined;
    sequence?: number | undefined;
    promise?: Promise<any> | void;
    f: () => Promise<any> | void;
    onStartCallback?: (() => void) | undefined;
    onCompleteCallback?: (() => void) | undefined;
    onRejectCallback?: (() => void) | undefined;
    _isRunning?: boolean;
    _isFinished?: boolean;
    _isRejected?: boolean;
    _index?: number | undefined;
    _startTime: number;
    _stopTime: number;
    _duration: number;
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
    _abort: AbortController;
    get _isRunning(): boolean;
    get _isFinished(): boolean;
    get _isRejected(): boolean;
    addWatch: (addWatchFunction: WatchFunction | (() => void)) => void;
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

declare function makeAsync<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => Promise<ReturnType<T>>;

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
    makeAsync: typeof makeAsync;
};

export { Group, Monitor, Sequence, Tree, Watch, type WatchFunction, _default as default, makeAsync, nextId, now, sleep, version };
