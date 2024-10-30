declare global {
    interface Console {
        useConsoleLog: boolean;
        highlight(text: RegExp | string, ids: {
            id: number;
            index?: number;
        }, className?: string | string[]): void;
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
    status: string;
    reason: any;
    value: any;
};
interface WatchFunctionOptions {
    f: () => Promise<any> | void;
    name?: string | undefined;
    parent?: string | undefined;
    child?: string | undefined;
    onStartCallback?: () => void;
    onCompleteCallback?: () => void;
    onRejectCallback?: () => void;
    onAbortCallback?: () => void;
}
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
    get isProcessed(): boolean;
    private _startTime;
    get startTime(): number;
    set startTime(value: number);
    private _stopTime;
    get stopTime(): number;
    set stopTime(value: number);
    private _duration;
    get duration(): number;
    private abortController;
    abort: () => void;
    signal: AbortSignal;
    name?: string | undefined;
    parent?: string | undefined;
    child?: string | undefined;
    group?: Group | undefined;
    f: () => Promise<any>;
    onStartCallback?: () => void;
    onCompleteCallback?: () => void;
    onRejectCallback?: () => void;
    onAbortCallback?: () => void;
    sequence: number;
    reset: () => void;
    'promise': Promise<any>;
    'promiseStatus': {
        status: string;
        reason: any;
        value: any;
    };
    get metrics(): Metric;
    constructor(arg: WatchFunctionOptions | (() => Promise<any> | void) | (() => {}), name?: string | undefined, parent?: string | undefined, child?: string | undefined, onStartCallback?: () => void, onCompleteCallback?: () => void, onRejectCallback?: () => void, onAbortCallback?: () => void, onErrorCallback?: () => void);
}

interface GroupOptions {
    repeat: number;
    runs: number;
}
declare class Group {
    options: GroupOptions;
    get run(): number;
    constructor(options?: GroupOptions);
    set useConsoleLog(value: boolean);
    get useConsoleLog(): boolean;
    private _id;
    get id(): number;
    private _functions;
    get functions(): WatchFunction[];
    get isRunning(): boolean;
    get isFinished(): boolean;
    get isRejected(): boolean;
    get isAborted(): boolean;
    get isProcessed(): boolean;
    private _startTime;
    get startTime(): number;
    set startTime(value: number);
    private _stopTime;
    get stopTime(): number;
    set stopTime(value: number);
    private _duration;
    get duration(): number;
    name?: string | undefined;
    private _onStartCallback?;
    get onStartCallback(): () => void;
    set onStartCallback(value: () => void);
    private _onStartRunCallback?;
    get onStartRunCallback(): () => void;
    set onStartRunCallback(value: () => void);
    private _onCompleteCallback?;
    get onCompleteCallback(): () => void;
    set onCompleteCallback(value: () => void);
    private _onCompleteRunCallback?;
    get onCompleteRunCallback(): () => void;
    set onCompleteRunCallback(value: () => void);
    private _onRejectCallback?;
    get onRejectCallback(): () => void;
    set onRejectCallback(value: () => void);
    private _onRejectRunCallback?;
    get onRejectRunCallback(): () => void;
    set onRejectRunCallback(value: () => void);
    private _onAbortCallback?;
    get onAbortCallback(): () => void;
    set onAbortCallback(value: () => void);
    private _onAbortRunCallback?;
    get onAbortRunCallback(): () => void;
    set onAbortRunCallback(value: () => void);
    sequence: number;
    private _onErrorCallback;
    get onErrorCallback(): () => void;
    set onErrorCallback(value: () => void);
    addWatch: (addWatchFunction: WatchFunctionOptions | Function) => void;
    abortWatch(name: string): void;
    abort(): void;
    reset(resetRuns?: boolean): void;
    getAll(): Array<WatchFunction>;
    removeAll(): void;
    add(): void;
    remove(): void;
    watchAll(): Promise<void> | void;
    get consoleTree(): string;
    get metrics(): Metric[];
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
interface TreeOptions {
    repeat?: number;
}
declare class Tree {
    private map;
    private roots;
    private consoleLogText;
    private repeatOptions;
    constructor(options?: TreeOptions);
    private buildTree;
    private collectTerminalNodes;
    private calculateMaxLength;
    private displayTreeWithLineLength;
    processTree(data: TreeData[]): string;
}

declare class Monitor {
    private functions;
    constructor(functions: Promise<any>[]);
    settled(): Promise<{
        statusesPromise: Array<PromiseSettledResult<any>>;
    }>;
}

declare const version = "1.1.8";

declare class Watch {
    constructor(fs: Array<WatchFunction>, f: (() => void) | Array<() => void>);
}

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
