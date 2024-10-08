(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MONITOR = {}));
})(this, (function (exports) { 'use strict';

    var __awaiter$1 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator$1 = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * The sleep function pauses execution for a specified amount of time. Useful for testing purposes as it
     * has a random option when param fail is not set.
     *
     * @param seconds - The number of seconds (default is a random number between 0 and 3).
     * @param fail - Whether the function should reject or not (default is `false`).
     * @returns A promise that resolves after `seconds` seconds or rejects based on the `fail` condition.
     */
    function sleep() {
        return __awaiter$1(this, arguments, void 0, function (seconds, fail) {
            if (seconds === void 0) { seconds = Math.random() * 3; }
            return __generator$1(this, function (_a) {
                if (fail === undefined)
                    fail = seconds * 4 < 1;
                seconds = seconds * 1000;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            if (fail) {
                                reject(seconds);
                            }
                            else {
                                resolve(seconds);
                            }
                        }, seconds);
                    })];
            });
        });
    }

    var Element = /** @class */ (function () {
        function Element(arg, name, parent, child, onStartCallback, onCompleteCallback, onRejectCallback, _startTime, _stopTime, _duration) {
            if (name === void 0) { name = ''; }
            if (parent === void 0) { parent = ''; }
            if (child === void 0) { child = ''; }
            if (onStartCallback === void 0) { onStartCallback = function () { }; }
            if (onCompleteCallback === void 0) { onCompleteCallback = function () { }; }
            if (onRejectCallback === void 0) { onRejectCallback = function () { }; }
            this.name = '';
            this.onStartCallback = function () { };
            this.onCompleteCallback = function () { };
            this.onRejectCallback = function () { };
            this._isFinished = false;
            this._isRunning = false;
            this._startTime = 0;
            this._stopTime = 0;
            this._duration = 0;
            if (typeof arg === 'object') {
                // If an object of type WatchFunction is passed, use its properties
                this.f = arg.f;
                (this.name = arg.name), (this.parent = arg.parent);
                this.child = arg.child;
                this.onStartCallback = arg.onStartCallback;
                this.onCompleteCallback = arg.onCompleteCallback;
                this.onRejectCallback = arg.onRejectCallback;
            }
            else {
                // If a function is passed, assign the passed or default values for other properties
                this.f = arg;
                this.name = name;
                this.parent = parent;
                this.child = child;
                this.onStartCallback = onStartCallback;
                this.onCompleteCallback = onCompleteCallback;
                this.onRejectCallback = onRejectCallback;
            }
            this._isFinished = false;
            this._isRunning = false;
        }
        return Element;
    }());

    var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (this && this.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
        return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (g && (g = 0, op[0] && (_ = 0)), _) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    var Monitor = /** @class */ (function () {
        function Monitor(fs) {
            this.fs = fs;
        }
        // Method to handle the async operation
        Monitor.prototype.monitorStatuses = function () {
            return __awaiter(this, void 0, void 0, function () {
                var statusesPromise;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, Promise.allSettled(this.fs)];
                        case 1:
                            statusesPromise = _a.sent();
                            return [2 /*return*/, {
                                    performance: performance.now(),
                                    statusesPromise: statusesPromise,
                                }];
                    }
                });
            });
        };
        return Monitor;
    }());

    var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    };
    var Watch = /** @class */ (function () {
        function Watch(fs, f, fr) {
            var _breakOnRejected = false;
            var _statuses = [];
            // Filter out entries where promise is undefined
            var validFs = fs
                .filter(function (x) { return x.promise instanceof Promise; })
                .map(function (x) { return x.promise; });
            var monitorInstance = new Monitor(validFs);
            document['monitorInstance'] = monitorInstance;
            return monitorInstance
                .monitorStatuses()
                .then(function (statuses) {
                if (statuses.statusesPromise.length > 1) {
                    console.log("statuses: ".concat(statuses.statusesPromise.map(function (x) { return x.status.toString(); }).join(',')));
                }
                else {
                    console.log("status: ".concat(statuses.statusesPromise.map(function (x) { return x.status.toString(); }).join(',')));
                }
                _breakOnRejected = statuses.statusesPromise.some(function (x) { return x.status === 'rejected'; });
                _statuses = statuses.statusesPromise
                    .map(function (v, i) { return ({ index: i.toString(), reason: v.reason, onRejectCallback: fs[i].onRejectCallback }); })
                    .filter(function (v) { return v.reason !== undefined; });
            })
                .catch(function (err) {
                console.warn('error:', err);
            })
                .finally(function () {
                if (_breakOnRejected) {
                    console.warn('Promise rejected...');
                    var fs0 = fs[0];
                    if (fs0.group && typeof fs0.group._onRejectedCallback === 'function')
                        fs0.group._onRejectedCallback();
                    if (fs0.group && typeof fs0.group._onCompleteCallback === 'function')
                        fs0.group._onCompleteCallback();
                    // f_rejected for specific function
                    _statuses.forEach(function (x) {
                        if (typeof x.onRejectCallback === 'function') {
                            try {
                                x.onRejectCallback(x.reason);
                            }
                            catch (error) {
                                console.warn('Watch.onRejectCallback is not critical:\n', error);
                            }
                        }
                        console.warn('onRejectCallback not provided.');
                    });
                    // f_rejected for global watch
                    if (typeof fr === 'function')
                        fr();
                    return;
                }
                else {
                    if (typeof f === 'function')
                        f();
                    if (Array.isArray(f)) {
                        f.forEach(function (callback) {
                            if (typeof callback === 'function') {
                                try {
                                    callback();
                                }
                                catch (error) {
                                    console.warn('Watch.onCompleteCallback is not critical:\n', error);
                                }
                            }
                        });
                    }
                }
            });
        }
        return Watch;
    }());
    var _sequence = 0;
    function WatchAll(group, callback, callback_error) {
        // Call the private function with the default parent value as undefined
        _watchAllInternal(group, undefined, callback, callback_error);
    }
    function _watchAllInternal(group, parent, callback, callback_error) {
        var watches = group._functions;
        debugger;
        if (watches.every(function (f) { return f._isFinished; })) {
            // All watches are finished
            group._stopTime = Date.now();
            group._duration = group._stopTime - group._startTime;
            if (typeof group._onCompleteCallback === 'function')
                group._onCompleteCallback();
            return;
        }
        if (typeof parent === 'function') {
            callback_error = callback;
            callback = parent;
            parent = undefined;
        }
        var children = watches.filter(function (x) { return x.parent === parent; });
        if (parent === undefined) {
            if (children.length === 0) {
                console.warn('Nothing to do.');
                if (typeof group._onCompleteCallback === 'function')
                    group._onCompleteCallback();
                return;
            }
            _sequence = 0;
            watches.forEach(function (x, i) { return (x._index = i); });
        }
        if (children.length > 0) {
            children.forEach(function (child) {
                child._isRunning = true;
                child._startTime = Date.now();
                child.sequence = _sequence;
                if (typeof child.onStartCallback === 'function')
                    try {
                        child.onStartCallback();
                    }
                    catch (error) {
                        console.warn("Watch: onStartCallback failed (sequence: ".concat(child.sequence, "):\n"), error);
                    }
                try {
                    child.promise = child.f();
                }
                catch (error) {
                    console.warn('Watch: critical! error in call to (async) function:\n', error);
                    child._stopTime = Date.now();
                    child._duration = child._stopTime - child._startTime;
                    child._isRunning = false;
                    if (typeof group._onUnCompleteCallback === 'function')
                        group._onUnCompleteCallback();
                    return;
                }
            });
            if (!group._isFinished) {
                var onCompleteCallback = children
                    .map(function (child) { return child.onCompleteCallback; })
                    .filter(function (child) { return !!child; });
                // Modify this part to ensure promises are provided in the expected format.
                var validChildren = children.map(function (child) {
                    var _a;
                    return ({
                        promise: (_a = child.promise) !== null && _a !== void 0 ? _a : Promise.resolve(), // Ensure promise is always defined
                        onRejectCallback: child.onRejectCallback,
                        group: child.group,
                    });
                });
                new Watch(validChildren, __spreadArray(__spreadArray([], onCompleteCallback, true), [
                    function () {
                        children.forEach(function (child) {
                            child._isRunning = false;
                            child._isFinished = true;
                            child._stopTime = Date.now();
                            child._duration = child._stopTime - (child._startTime || 0);
                        });
                        if (!watches.some(function (x) { return x._isRunning; }) && watches.every(function (x) { return x._isFinished; })) {
                            if (typeof callback === 'function')
                                callback();
                        }
                        _sequence++;
                        watches
                            .filter(function (x) { return x.parent === parent; })
                            .map(function (x) { return x.child; })
                            .forEach(function (x) {
                            _watchAllInternal(group, x, callback, callback_error);
                        });
                    },
                ], false), callback_error);
            }
        }
    }

    // Example Usage
    // const data: TreeData[] = [
    // 	{name: undefined, parent: undefined, child: 'a'},
    // 	{name: 'fetch data a', parent: 'a', child: 'b'},
    // 	{name: 'fetch data b', parent: 'a', child: 'b'},
    // 	{name: 'make snow flake', parent: 'b', child: 3},
    // 	{name: 'publish to s3', parent: 3, child: 'y'},
    // 	{name: 'publish to s4', parent: 3, child: undefined},
    // 	{name: 'do quality check', parent: 'b', child: 'd'},
    // 	{name: 'on s3', parent: 'd', child: 'z'},
    // ];
    var Tree = /** @class */ (function () {
        function Tree() {
            this.map = {};
            this.roots = [];
            this.consoleLogText = '';
        }
        // Step 1: Build a tree structure from the array and combine nodes with the same parent-child relation
        Tree.prototype.buildTree = function (arr) {
            var _this = this;
            arr.forEach(function (_a) {
                var parent = _a.parent, child = _a.child, name = _a.name;
                // Ensure that 'child' is not undefined before using it as an index
                if (child !== undefined) {
                    if (!_this.map[child]) {
                        _this.map[child] = {
                            name: child,
                            description: name || String(child),
                            children: [],
                        };
                    }
                    else {
                        if (name && !_this.map[child].description.includes(name)) {
                            _this.map[child].description += ", ".concat(name);
                        }
                    }
                }
                if (parent === undefined) {
                    if (child !== undefined) {
                        if (!_this.map[child]) {
                            _this.map[child] = {
                                name: child,
                                description: name || String(child),
                                children: [],
                            };
                        }
                        _this.roots.push(_this.map[child]);
                    }
                }
                else {
                    if (!_this.map[parent]) {
                        _this.map[parent] = {
                            name: parent,
                            description: String(parent),
                            children: [],
                        };
                    }
                    if (child !== undefined) {
                        var existingChild = _this.map[parent].children.find(function (c) { return c.name === child; });
                        if (!existingChild) {
                            _this.map[parent].children.push(_this.map[child]);
                        }
                    }
                    else {
                        if (!_this.map[parent].children.some(function (c) { return c.description === name; })) {
                            _this.map[parent].children.push({
                                name: '',
                                description: name || '',
                                children: [],
                            });
                        }
                    }
                }
            });
            return this.roots;
        };
        // Step 2: Collect all terminal nodes (nodes without children)
        Tree.prototype.collectTerminalNodes = function (node, terminalNodes) {
            var _this = this;
            if (terminalNodes === void 0) { terminalNodes = []; }
            if (node.children.length === 0) {
                terminalNodes.push(node);
            }
            node.children.forEach(function (child) { return _this.collectTerminalNodes(child, terminalNodes); });
            return terminalNodes;
        };
        // Step 3: Function to calculate the longest line length (dry run without output)
        Tree.prototype.calculateMaxLength = function (node, prefix, isFirst, isLast, maxLengthObj) {
            var _this = this;
            if (prefix === void 0) { prefix = ''; }
            if (isFirst === void 0) { isFirst = true; }
            if (isLast === void 0) { isLast = true; }
            if (maxLengthObj === void 0) { maxLengthObj = { maxLength: 0 }; }
            var line = "".concat(isFirst ? '──' : prefix).concat(isLast && !isFirst ? '└─' : '├─', " ").concat(node.description);
            // Calculate the longest line length during this dry run
            if (line.length > maxLengthObj.maxLength) {
                maxLengthObj.maxLength = line.length;
            }
            var newPrefix = prefix + (isLast ? '   ' : '│  ');
            node.children.forEach(function (child, index) {
                var isLastChild = index === node.children.length - 1;
                _this.calculateMaxLength(child, newPrefix, false, isLastChild, maxLengthObj);
            });
        };
        // Step 4: Function to display the tree and include longest line length at terminal nodes
        Tree.prototype.displayTreeWithLineLength = function (node, prefix, isFirst, isLast, terminalIndex, maxLength, encounteredTerminalRef) {
            var _this = this;
            if (prefix === void 0) { prefix = ''; }
            if (isFirst === void 0) { isFirst = true; }
            if (isLast === void 0) { isLast = true; }
            var isTerminal = node.children.length === 0;
            var terminalLabel = '';
            var line = "".concat(isFirst ? '──' : prefix + (isLast && !isFirst ? '└─' : '├─'), " ").concat(node.description);
            if (isTerminal) {
                var index = terminalIndex.current++;
                terminalLabel = index === 0 ? '─┐' : '─┤';
                // Pad terminal lines with '─'
                var paddingNeeded = maxLength - (line.length + terminalLabel.length);
                if (paddingNeeded > 0) {
                    line += ' ' + '─'.repeat(paddingNeeded + 1);
                }
                line += terminalLabel;
                encounteredTerminalRef.value = true; // Set the flag to true once a terminal node is encountered
            }
            else {
                // Pad non-terminal lines with spaces and check if it appears after a terminal node
                var paddingNeeded = maxLength - line.length;
                if (paddingNeeded > 0) {
                    line += ' '.repeat(paddingNeeded + 1);
                }
                if (encounteredTerminalRef.value) {
                    line += '│'; // Pad non-terminal nodes that appear after the first terminal node with '│'
                }
            }
            this.consoleLogText += line.trimEnd() + '\r\n';
            var newPrefix = prefix + (isLast ? '   ' : '│  ');
            node.children.forEach(function (child, index) {
                var isLastChild = index === node.children.length - 1;
                _this.displayTreeWithLineLength(child, newPrefix, false, isLastChild, terminalIndex, maxLength, encounteredTerminalRef);
            });
        };
        // Method to initiate the tree processing and display
        Tree.prototype.processTree = function (data) {
            var _this = this;
            // Step 1: Build tree
            var tree = this.buildTree(data);
            // Step 2: Dry run to calculate the longest line
            var maxLengthObj = { maxLength: 0 };
            tree.forEach(function (root) { return _this.calculateMaxLength(root, '', true, true, maxLengthObj); });
            // Step 3: Track terminal node indices
            var terminalNodes = [];
            tree.forEach(function (root) { return _this.collectTerminalNodes(root, terminalNodes); });
            var terminalIndex = { current: 0, total: terminalNodes.length };
            // Step 4: Track whether we've encountered a terminal node
            var encounteredTerminalRef = { value: false };
            // Step 5: Display the tree with the longest line length added to terminal nodes and padded
            tree.forEach(function (root) {
                return _this.displayTreeWithLineLength(root, '', true, true, terminalIndex, maxLengthObj.maxLength, encounteredTerminalRef);
            });
            // Step 6: Add final completion line
            this.consoleLogText += ' '.repeat(maxLengthObj.maxLength + 1) + '└─ completed';
            // Return the console output as string
            return this.consoleLogText;
        };
        return Tree;
    }());

    var _group_id = 0;
    var Group = /** @class */ (function () {
        function Group() {
            var _this = this;
            this._id = _group_id++;
            this._functions = [];
            this._startTime = 0;
            this._stopTime = 0;
            this._duration = 0;
            this._seq = 0;
            // Default Callbacks
            this._onStartCallback = function () {
                console.group('Group: ' + _this._id);
                console.log('*** START ***');
            };
            this._onCompleteCallback = function () {
                console.log('*** COMPLETE ***');
                console.groupEnd();
            };
            this._onUnCompleteCallback = function () {
                console.log('*** UNCOMPLETE! ***');
            };
            this._onRejectedCallback = function () {
                console.log('*** REJECTED ***');
            };
            this._abort = new AbortController(); // Declare abort controller
            // Add a watch function
            this.addWatch = function (addWatchFunction) {
                debugger;
                var watchFunction;
                if (typeof addWatchFunction === 'function') {
                    watchFunction = new Element(addWatchFunction);
                    if (_this._seq === 0) {
                        watchFunction.parent = watchFunction.parent || undefined;
                        watchFunction.child = '_monitor_1';
                        _this._seq = 1;
                    }
                    else {
                        watchFunction.parent = '_monitor_' + _this._seq++;
                        watchFunction.child = '_monitor_' + _this._seq;
                    }
                }
                else {
                    // Create a new Element and add it to the group
                    watchFunction = new Element(addWatchFunction);
                }
                watchFunction.group = _this;
                _this._functions.push(watchFunction);
            };
        }
        Object.defineProperty(Group.prototype, "_isRunning", {
            // Check if any function in the group is running
            get: function () {
                return !!this._functions.map(function (x) { return x._isRunning; }).reduce(function (a, b) { return a || b; }, false);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Group.prototype, "_isFinished", {
            // Check if any function in the group is running
            get: function () {
                return !!this._functions.map(function (x) { return x._isFinished; }).reduce(function (a, b) { return a && b; }, true);
            },
            enumerable: false,
            configurable: true
        });
        // Abort the group TODO
        Group.prototype.abort = function () {
            this._abort.abort();
        };
        // Reset all watch functions in the group
        Group.prototype.reset = function () {
            this._functions.forEach(function (x) { return (x._isRunning = false); });
            this._functions.forEach(function (x) { return (x._isFinished = false); });
        };
        // Get all functions in the group
        Group.prototype.getAll = function () {
            return this._functions;
        };
        // Remove all functions from the group
        Group.prototype.removeAll = function () {
            this._functions = [];
        };
        // Add and remove placeholders
        Group.prototype.add = function () { };
        Group.prototype.remove = function () { };
        Group.prototype.Watch = function (callback, callback_error) {
            var _this = this;
            var watchArray = this._functions.map(function (fn) {
                var _a;
                return ({
                    promise: (_a = fn.promise) !== null && _a !== void 0 ? _a : undefined, // Use the promise if it exists, otherwise undefined
                    onRejectCallback: fn.onRejectCallback, // The callback if the function fails
                    group: _this, // The current group
                });
            });
            return new Watch(watchArray, callback, callback_error);
        };
        Group.prototype.WatchAll = function (callback, callback_error) {
            var _this = this;
            this.__callback = callback !== null && callback !== void 0 ? callback : (function () { });
            this.__callback_error = callback_error !== null && callback_error !== void 0 ? callback_error : (function () { });
            if (callback !== undefined) {
                this.__callback = callback;
            }
            else {
                callback = this.__callback;
            }
            if (callback_error !== undefined) {
                this.__callback_error = callback_error;
            }
            else {
                callback_error = this.__callback_error;
            }
            if (this._isRunning) {
                console.warn('This WatchAll group is already being monitored.');
                if (typeof this._onCompleteCallback === 'function')
                    this._onCompleteCallback();
                return;
            }
            this._startTime = Date.now();
            if (typeof this._onStartCallback === 'function')
                this._onStartCallback();
            // Create an array of valid watch objects from the group's functions
            this._functions.map(function (fn) {
                var _a;
                return ({
                    promise: (_a = fn.promise) !== null && _a !== void 0 ? _a : undefined, // Use the promise if it exists, otherwise undefined
                    onRejectCallback: fn.onRejectCallback, // The callback for rejection
                    group: _this, // The current group,
                    _startTime: Date.now(),
                });
            });
            // Pass the array to the WatchAll function
            return WatchAll(this, callback, callback_error);
        };
        Object.defineProperty(Group.prototype, "consoleTree", {
            get: function () {
                var treeData = this._functions.map(function (f) {
                    return { name: f.name, parent: f.parent, child: f.child };
                });
                var treeBuilder = new Tree();
                return treeBuilder.processTree(treeData);
            },
            enumerable: false,
            configurable: true
        });
        Group.prototype.onRejected = function (callback) {
            this._onRejectedCallback = callback;
            return this;
        };
        Group.prototype.onStart = function (callback) {
            this._startTime = Date.now(); //#m
            this._onStartCallback = callback;
            return this;
        };
        Group.prototype.onComplete = function (callback) {
            debugger;
            this._stopTime = Date.now(); //#m
            this._onCompleteCallback = callback;
            return this;
        };
        return Group;
    }());

    var now = function () { return performance.now(); };

    /**
     * Sequence
     *
     * A utility class that provides sequential unique IDs.
     * It maintains a static counter that increments with each call to `nextId()`,
     * ensuring that each ID is unique within the runtime of the application.
     */
    var Sequence = /** @class */ (function () {
        function Sequence() {
        }
        Sequence.nextId = function () {
            return Sequence._nextId++;
        };
        Sequence._nextId = 0;
        return Sequence;
    }());

    var version = '1.0.5';

    var nextId = Sequence.nextId;
    // Use default export if necessary
    var Index = {
        Group: Group,
        now: now,
        Sequence: Sequence,
        nextId: nextId,
        Monitor: Monitor,
        version: version,
        Watch: Watch,
        sleep: sleep,
        Tree: Tree,
    };

    exports.Group = Group;
    exports.Monitor = Monitor;
    exports.Sequence = Sequence;
    exports.Tree = Tree;
    exports.Watch = Watch;
    exports.default = Index;
    exports.nextId = nextId;
    exports.now = now;
    exports.sleep = sleep;
    exports.version = version;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
