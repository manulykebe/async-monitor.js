'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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

var version = '1.1.13';

function createTableFromObject(data) {
    var table = document.createElement('table');
    table.classList.add('log-table');
    if (Array.isArray(data) && data.length > 0) {
        var headerRow_1 = document.createElement('tr');
        var keys_1 = Object.keys(data[0]);
        keys_1.forEach(function (key) {
            var th = document.createElement('th');
            th.textContent = key;
            th.classList.add('log-table-header');
            headerRow_1.appendChild(th);
        });
        table.appendChild(headerRow_1);
        data.forEach(function (item) {
            var row = document.createElement('tr');
            keys_1.forEach(function (key) {
                var td = document.createElement('td');
                var jsonstring = '';
                try {
                    jsonstring = JSON.stringify(item[key]);
                }
                catch (error) {
                    jsonstring = "".concat(key, ": ").concat(error);
                }
                td.textContent = typeof item[key] === 'object' ? jsonstring : item[key];
                td.classList.add('log-table-cell');
                row.appendChild(td);
            });
            table.appendChild(row);
        });
    }
    else if (typeof data === 'object') {
        var headerRow = document.createElement('tr');
        var thKey = document.createElement('th');
        thKey.textContent = 'Property';
        thKey.classList.add('log-table-header');
        var thValue = document.createElement('th');
        thValue.textContent = 'Value';
        thValue.classList.add('log-table-header');
        headerRow.appendChild(thKey);
        headerRow.appendChild(thValue);
        table.appendChild(headerRow);
        Object.keys(data).forEach(function (key) {
            var row = document.createElement('tr');
            var keyCell = document.createElement('td');
            keyCell.textContent = key;
            keyCell.classList.add('log-table-cell');
            var valueCell = document.createElement('td');
            var jsonstring = '';
            try {
                jsonstring = JSON.stringify(data[key], undefined, 4);
            }
            catch (error) {
                jsonstring = "".concat(key, ": ").concat(error);
            }
            valueCell.textContent =
                typeof data[key] === 'object' ? jsonstring : data[key];
            valueCell.classList.add('log-table-cell');
            row.appendChild(keyCell);
            row.appendChild(valueCell);
            table.appendChild(row);
        });
    }
    return table;
}
function escapeRegExp(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function findSpanElementWithClassAndText(text, _id, className) {
    var treeElement = document.querySelector("pre[class*=\"tree-".concat(_id, "\"]"));
    if (!treeElement)
        return null;
    var spanElements = treeElement.querySelectorAll("span.highlight-".concat(className));
    for (var _i = 0, _a = Array.from(spanElements); _i < _a.length; _i++) {
        var span = _a[_i];
        if (typeof text === 'string' && span.textContent === text) {
            return span;
        }
        else if (text instanceof RegExp && span.textContent !== null && text.test(span.textContent)) {
            return span;
        }
    }
    return null;
}
function getCurrentTime() {
    var now = new Date();
    return now.toTimeString().split(' ')[0];
}
var Logger = /** @class */ (function () {
    function Logger(useLogger) {
        if (useLogger === void 0) { useLogger = false; }
        this.useLogger = useLogger;
        this.id = "logger-".concat(Sequence.nextId());
    }
    Logger.prototype.addToDocument = function (location, divId) {
        if (location === void 0) { location = document.body; }
        if (divId === void 0) { divId = this.id; }
        this.addCSSToDocument();
        var div = document.getElementById(divId);
        if (div) {
            div.innerHTML = '';
        }
        else {
            var loggerDiv = document.createElement('div');
            loggerDiv.id = divId;
            loggerDiv.classList.add("logger", "".concat(this.id));
            location.appendChild(loggerDiv);
        }
        this.log("async-monitor.js$".concat(version), 'log-info');
        return true;
    };
    Logger.prototype.addCSSToDocument = function (cssHref) {
        if (cssHref === void 0) { cssHref = 'https://manulykebe.github.io/async-monitor.js/examples/styles.css'; }
        var existingLink = document.querySelector("link[href=\"".concat(cssHref, "\"]"));
        if (!existingLink) {
            var link = document.createElement('link');
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = cssHref;
            document.head.appendChild(link);
        }
    };
    Logger.prototype.appendLogTologger = function (message, classnames, _id) {
        if (message === null)
            message = '<null>';
        if (message === undefined)
            message = '<undefined>';
        if (typeof message === 'string' && message.trim() === '')
            return;
        var loggerDiv = document.getElementById(this.id);
        if (loggerDiv) {
            var logEntry = document.createElement('div');
            logEntry.classList.add('log-entry');
            var timeCol = document.createElement('div');
            timeCol.classList.add('log-time');
            timeCol.textContent = getCurrentTime();
            var messageCol = document.createElement('div');
            messageCol.classList.add('log-message');
            if (typeof message === 'object') {
                var table = createTableFromObject(message);
                messageCol.appendChild(table);
            }
            else {
                var pre_1 = document.createElement('pre');
                if (!Array.isArray(classnames))
                    classnames = [classnames];
                if (!_id && typeof _id === 'number') {
                    classnames.push("log-group-".concat(_id));
                }
                classnames.forEach(function (c) {
                    if (typeof c === 'string' && c.trim() !== '') {
                        pre_1.classList.add(c.trim());
                    }
                });
                pre_1.textContent = message;
                messageCol.appendChild(pre_1);
            }
            logEntry.appendChild(timeCol);
            logEntry.appendChild(messageCol);
            loggerDiv.appendChild(logEntry);
        }
    };
    Logger.prototype.clear = function () {
        if (!this.useLogger)
            return;
        var loggerDiv = document.getElementById(this.id);
        if (loggerDiv) {
            loggerDiv.innerHTML = '';
        }
        this.log("async-monitor.js$".concat(version));
        this.log("".concat(this.id));
    };
    Logger.prototype.log = function (message, classnames) {
        var _id;
        if (typeof classnames === 'number') {
            _id = classnames;
            classnames = undefined;
        }
        this.appendLogTologger(message, classnames || [], _id);
    };
    Logger.prototype.warn = function (message, _id) {
        this.appendLogTologger(message, 'log-warn', _id);
    };
    Logger.prototype.error = function (message, _id) {
        this.appendLogTologger(message, 'log-error', _id);
    };
    Logger.prototype.group = function (label, _id) {
        this.appendLogTologger("".concat(label), 'log-group', _id);
    };
    Logger.prototype.table = function (data) {
        this.appendLogTologger(data, 'log-table');
    };
    Logger.prototype.highlight = function (text, ids, className) {
        if (className === void 0) { className = 'start'; }
        var treeElement = document.querySelector("pre[class*=\"tree-".concat(ids.id, "\"]"));
        if (!treeElement) {
            this.warn("could not highlight tree-".concat(ids.id, "."));
            return;
        }
        if (!Array.isArray(className))
            className = [className];
        if (className.includes('start')) {
            var regex = void 0;
            if (typeof text === 'string') {
                regex = new RegExp(escapeRegExp(text), 'gi');
            }
            else {
                regex = new RegExp(text, 'g');
            }
            var highlightedText = treeElement.innerHTML.replace(regex, function (match) {
                return "<span data-monitor-tree=\"".concat(ids.id, "\" data-monitor-index=\"").concat(ids.index, "\" class=\"highlight-").concat(className.join(' highlight-'), "\"><i class=\"fas fa-stop icon\" onclick=\"interact();\"></i>").concat(match, "</span>");
            });
            treeElement.innerHTML = highlightedText;
        }
        else {
            var spanElement = findSpanElementWithClassAndText(text, ids.id, 'start');
            if (spanElement) {
                spanElement.classList.remove("highlight-start");
                spanElement.classList.add("highlight-".concat(className));
            }
        }
    };
    Logger.prototype.clearHighlights = function (_id) {
        var treeElement = document.querySelector("pre[class*=\"tree-".concat(_id, "\"]"));
        if (treeElement) {
            treeElement.querySelectorAll("span").forEach(function (span) {
                if (!(span.innerText === 'completed' || span.classList.contains('highlight-repeat')))
                    span.outerHTML = span.innerHTML;
            });
        }
    };
    Logger.prototype.displayRepeat = function (_id, runsNo, repeatNo) {
        var treeElement = document.querySelector("pre[class*=\"tree-".concat(_id, "\"]"));
        if (treeElement) {
            var repeatElement = treeElement.querySelector("span[class*=\"highlight-repeat\"]");
            if (repeatElement) {
                repeatElement.innerText =
                    ' '.repeat(1 - runsNo.toString().length + repeatNo.toString().length) +
                        runsNo.toString().concat('/').concat(repeatNo.toString()).concat(' ');
            }
        }
    };
    return Logger;
}());

var __awaiter$2 = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator$2 = (this && this.__generator) || function (thisArg, body) {
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
    return __awaiter$2(this, arguments, void 0, function (seconds, fail) {
        if (seconds === void 0) { seconds = Math.random() * 3; }
        return __generator$2(this, function (_a) {
            if (fail === undefined)
                fail = seconds / 3 < 0.5;
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
var Monitor = /** @class */ (function () {
    function Monitor(functions) {
        this.functions = functions;
    }
    Monitor.prototype.settled = function () {
        return __awaiter$1(this, void 0, void 0, function () {
            var statusesPromise;
            return __generator$1(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Promise.allSettled(this.functions)];
                    case 1:
                        statusesPromise = _a.sent();
                        return [2 /*return*/, {
                                statusesPromise: statusesPromise,
                            }];
                }
            });
        });
    };
    return Monitor;
}());

var now = function () { return parseFloat(performance.now().toFixed(0)); };
function calcDuration(start, end) {
    return parseFloat((end - start).toFixed(0));
}

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
var Watch = /** @class */ (function () {
    function Watch(fs, f) {
        var breakOnReject = false;
        // let _statuses: Array<{index: string; reason: any; onRejectCallback?: (reason: any) => void}> = [];
        // Filter out entries where promise is undefined
        var promises = fs.map(function (x) { return x.promise; });
        var monitorInstance = new Monitor(promises);
        return monitorInstance
            .settled()
            .then(function (_a) {
            var statusesPromise = _a.statusesPromise;
            for (var i = 0; i < statusesPromise.length; i++) {
                fs[i].promiseStatus.status = statusesPromise[i].status;
                fs[i].promiseStatus.reason =
                    statusesPromise[i].status === 'rejected' ? statusesPromise[i].reason : undefined;
                fs[i].promiseStatus.value =
                    statusesPromise[i].status === 'fulfilled'
                        ? statusesPromise[i].value
                        : undefined;
            }
            breakOnReject = statusesPromise.some(function (x) { return x.status === 'rejected'; });
            // _statuses = statusesPromise
            // 	.map((v, i) => ({index: i.toString(), reason: v.reason, onRejectCallback: fs[i].onRejectCallback}))
            // 	.filter(v => v.reason !== undefined);
        })
            .catch(function (err) {
            console.warn('error:', err);
        })
            .finally(function () {
            if (breakOnReject) {
                var fs0 = fs[0];
                // if (typeof fs0.group?.__callback_error === 'function') fs0.group.__callback_error();
                // if (fs0.group && typeof fs0.group._onCompleteCallback === 'function') fs0.group._onCompleteCallback();
                // // f_rejected for specific function
                // _statuses.forEach(x => {
                // 	if (typeof x.onRejectCallback === 'function') {
                // 		try {
                // 			x.onRejectCallback(x.reason);
                // 		} catch (error) {
                // 			group.logger.warn('Watch.onRejectCallback is not critical:\n', error);
                // 		}
                // 	}
                // 	// group.logger.warn('onRejectCallback not provided.');
                // });
                // // f_rejected for global watch
                // if (typeof fr === 'function') fr();
                if (fs0.group && typeof fs0.group.onRejectCallback === 'function')
                    fs0.group.onRejectCallback();
                return;
            }
            else {
                if (!Array.isArray(f))
                    f = [f];
                if (Array.isArray(f)) {
                    f.forEach(function (cbf) {
                        if (typeof cbf === 'function') {
                            // try {
                            cbf();
                            // } catch (error) {
                            // 	group.logger.warn('Error while executing cbf.', error);
                            // 	group.logger.log(cbf);
                            // }
                        }
                    });
                }
            }
        });
    }
    return Watch;
}());
var _sequence = 0;
function watchAll(group) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (group.functions.filter(function (x) { return x.parent === undefined; }).length < 1) {
                group.logger.error('Group must have exactly one root function (aka parent === undefined)!');
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        reject();
                    })];
            }
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    _watchAllInternal(group, undefined, resolve, reject);
                })];
        });
    });
}
function _watchAllInternal(group, parent, resolve, reject) {
    var watches = group.functions;
    group.useLogger;
    var children = watches.filter(function (x) { return x.parent === parent; });
    if (watches.every(function (f) { return f.isFinished; })) {
        group.stopTime = now();
        if (group.options.repeat === 0) {
            if (typeof group.onCompleteCallback === 'function') {
                group.onCompleteCallback();
            }
            resolve && resolve();
            return;
        }
        else if (group.options.repeat > 0) {
            if (typeof group.onCompleteRunCallback === 'function') {
                group.onCompleteRunCallback();
            }
            if (group.options.repeat > group.options.runs) {
                group.options.runs++;
                group.reset(false);
                return _watchAllInternal(group, undefined, resolve, reject);
            }
            else {
                if (typeof group.onCompleteCallback === 'function') {
                    group.onCompleteCallback();
                }
                resolve && resolve();
                return;
            }
        }
    }
    if (watches.some(function (f) { return f.isRejected; })) {
        if (group.logger.useLogger) {
            group.logger.warn('Some watches are rejected.');
        }
        if (typeof group.onRejectCallback === 'function') {
            group.onRejectCallback();
        }
        reject && reject();
        return;
    }
    if (watches.some(function (f) { return f.isAborted; })) {
        // Some watch was aborted
        if (group.logger.useLogger) {
            group.logger.warn('Some watches are aborted.');
        }
        if (typeof group.onAbortCallback === 'function') {
            group.onAbortCallback();
        }
        reject && reject();
        return;
    }
    if (parent === undefined) {
        if (children.length === 0) {
            return;
        }
        if (group.options.repeat > 0) {
            if (typeof group.onStartRunCallback === 'function')
                group.onStartRunCallback();
        }
        _sequence = 0;
    }
    if (children.length > 0) {
        var grandChildren = children
            .map(function (x) { return x.child; })
            .filter(function (currentValue, index, arr) { return arr.indexOf(currentValue) === index; });
        grandChildren.forEach(function (gc) {
            _sequence++;
            children
                .filter(function (c) { return c.child === gc; })
                .forEach(function (child) {
                child.sequence = _sequence;
                group.logger.highlight(child.name || "g:".concat(group.id, ",c:").concat(child.id), { id: group.id, index: child.id }, 'start');
                if (typeof child.onStartCallback === 'function') {
                    child.onStartCallback();
                }
                // try {
                if (typeof child.f === 'function') {
                    var result = child.f();
                    // If result is void (undefined), log a warning or handle it accordingly
                    if (result === undefined || result === null) {
                        if (group.logger.useLogger) {
                            group.logger.warn('Function returned void');
                        }
                    }
                    // Check if result is a promise by checking the presence of the then method
                    else if (typeof result.then === 'function') {
                        child.promise = result;
                        child.promise.then(function () {
                            if (typeof child.onCompleteCallback === 'function') {
                                child.onCompleteCallback();
                            }
                            group.logger.highlight(child.name || "g:".concat(group.id, ",c:").concat(child.id), { id: group.id }, 'complete');
                        });
                        child.promise.catch(function () {
                            if (typeof child.onRejectCallback === 'function') {
                                child.onRejectCallback();
                            }
                            group.logger.highlight(child.name || "g:".concat(group.id, ",c:").concat(child.id), { id: group.id }, 'rejected');
                            group.logger.highlight('completed', { id: group.id }, 'rejected');
                            reject && reject();
                        });
                    }
                    // Handle any other unexpected return values
                    else {
                        if (group.logger.useLogger) {
                            group.logger.warn('Function did not return a promise');
                        }
                    }
                }
                // } catch (error) {
                // if (group.logger.useLogger) {
                // 	group.logger.warn('Watch: critical! error in call to (async) function:\n', error);
                // }
                // 	if (typeof group.onErrorCallback === 'function') group.onErrorCallback();
                // 	return;
                // }
            });
        });
        if (group.isFinished) ;
        else {
            grandChildren.forEach(function (gc) {
                var validChildren = children
                    .filter(function (c) { return c.child === gc; })
                    .map(function (child) {
                    var _a;
                    child.promise = (_a = child.promise) !== null && _a !== void 0 ? _a : Promise.resolve();
                    return child;
                });
                new Watch(validChildren, [
                    function () {
                        watches
                            .filter(function (x) { return x.parent === parent; })
                            .filter(function (c) {
                            return c.child === gc;
                        })
                            .map(function (x) { return x.child; })
                            .filter(function (currentValue, index, arr) { return arr.indexOf(currentValue) === index; })
                            .forEach(function (x) {
                            _watchAllInternal(group, x, resolve, reject);
                        });
                    },
                ]);
            });
        }
    }
}

var Tree = /** @class */ (function () {
    // repeater not in use by default, -1 is infinite, >0 is number of loops
    function Tree(options) {
        if (options === void 0) { options = {}; }
        var _a;
        this.map = {};
        this.roots = [];
        this.consoleLogText = '';
        this.repeatOptions = { repeat: 0, current: 0 };
        this.repeatOptions.repeat = (_a = options.repeat) !== null && _a !== void 0 ? _a : 0;
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
    Tree.prototype.calculateMaxLength = function (node, prefix, isFirst, isFirstRoot, isLast, maxLengthObj) {
        var _this = this;
        if (prefix === void 0) { prefix = ''; }
        if (isFirst === void 0) { isFirst = true; }
        if (isFirstRoot === void 0) { isFirstRoot = true; }
        if (isLast === void 0) { isLast = true; }
        if (maxLengthObj === void 0) { maxLengthObj = { maxLength: 0 }; }
        var repeatIndicator = ' ';
        var repeatIndicatorFirstLine = '─';
        if (this.repeatOptions.repeat != 0) {
            repeatIndicator = ' │';
            repeatIndicatorFirstLine = isFirst ? (isFirstRoot ? '┬─' : '┼─') : '─';
        }
        var line = "".concat(isFirst ? '─' + repeatIndicatorFirstLine + '─' : repeatIndicator + prefix + (isLast && !isFirst ? '└─' : '├─'), " ").concat(node.description);
        // Calculate the longest line length during this dry run
        if (line.length > maxLengthObj.maxLength) {
            maxLengthObj.maxLength = line.length;
        }
        var newPrefix = prefix + (isLast ? '    ' : ' │  ');
        node.children.forEach(function (child, index) {
            var isLastChild = index === node.children.length - 1;
            _this.calculateMaxLength(child, newPrefix, false, isFirstRoot, isLastChild, maxLengthObj);
        });
    };
    // Step 4: Function to display the tree and include longest line length at terminal nodes
    Tree.prototype.displayTreeWithLineLength = function (node, prefix, isFirst, isFirstRoot, isLast, terminalIndex, maxLength, encounteredTerminalRef) {
        var _this = this;
        if (prefix === void 0) { prefix = ''; }
        if (isFirst === void 0) { isFirst = true; }
        if (isFirstRoot === void 0) { isFirstRoot = false; }
        if (isLast === void 0) { isLast = true; }
        var isTerminal = node.children.length === 0;
        var repeatIndicator = ' ';
        var repeatIndicatorFirstLine = '─';
        var terminalLabel = '';
        if (this.repeatOptions.repeat != 0) {
            repeatIndicator = ' │';
            repeatIndicatorFirstLine = isFirst ? (isFirstRoot ? '┬─' : '┼─') : '─';
        }
        var line = "".concat(isFirst ? '─' + repeatIndicatorFirstLine + '─' : repeatIndicator + prefix + (isLast && !isFirst ? '└─' : '├─'), " ").concat(node.description);
        if (isTerminal) {
            var index = terminalIndex.current++;
            terminalLabel = index === 0 ? '─┐' : '─┤';
            // Pad terminal lines with '─'
            var paddingNeeded = maxLength - (line.length + terminalLabel.length);
            if (paddingNeeded > 0) {
                line += '─'.repeat(paddingNeeded + 1);
            }
            line += '─' + terminalLabel;
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
            _this.displayTreeWithLineLength(child, newPrefix, false, isFirstRoot, isLastChild, terminalIndex, maxLength, encounteredTerminalRef);
        });
    };
    // Method to initiate the tree processing and display
    Tree.prototype.processTree = function (data) {
        var _this = this;
        if (data.length === 0) {
            return '<empty tree>';
        }
        // Step 1: Build tree
        var tree = this.buildTree(data);
        // Step 2: Dry run to calculate the longest line
        var maxLengthObj = { maxLength: 0 };
        tree.forEach(function (root) { return _this.calculateMaxLength(root, '', true, false, true, maxLengthObj); });
        // Step 3: Track terminal node indices
        var terminalNodes = [];
        tree.forEach(function (root) { return _this.collectTerminalNodes(root, terminalNodes); });
        var terminalIndex = { current: 0, total: terminalNodes.length };
        // Step 4: Track whether we've encountered a terminal node
        var encounteredTerminalRef = { value: false };
        // Step 5: Display the tree with the longest line length added to terminal nodes and padded
        tree.forEach(function (root, indx) {
            return _this.displayTreeWithLineLength(root, '', true, indx === 0, true, terminalIndex, maxLengthObj.maxLength, encounteredTerminalRef);
        });
        // Step 6: Add final completion line
        if (this.repeatOptions.repeat != 0) {
            var repeatText = this.repeatOptions.repeat == -1
                ? ' ∞ '
                : ' '.repeat(String(this.repeatOptions.repeat).length) + '1/' + this.repeatOptions.repeat + ' ';
            this.consoleLogText +=
                ' └' + repeatText + '─'.repeat(Math.max(1, maxLengthObj.maxLength - repeatText.length - 1)) + '┤\r\n';
        }
        this.consoleLogText += ' '.repeat(maxLengthObj.maxLength + 1) + '└─ completed';
        return this.consoleLogText;
    };
    return Tree;
}());
/*
Corner and Tee Shapes:

└ (Box Drawings Light Up and Right)
┘ (Box Drawings Light Up and Left)
┌ (Box Drawings Light Down and Right)
┐ (Box Drawings Light Down and Left)
├ (Box Drawings Light Vertical and Right)
┤ (Box Drawings Light Vertical and Left)
┬ (Box Drawings Light Down and Horizontal)
┴ (Box Drawings Light Up and Horizontal)
┼ (Box Drawings Light Vertical and Horizontal)

*/

var WatchFunction = /** @class */ (function () {
    function WatchFunction(arg, name, parent, child, onStartCallback, onCompleteCallback, onRejectCallback, onAbortCallback, onErrorCallback) {
        var _this = this;
        var _a;
        this._id = Sequence.nextId();
        this._isAborted = false;
        this._isFinished = false;
        this._isRejected = false;
        this._isRunning = false;
        this._startTime = 0;
        this._stopTime = 0;
        this._duration = 0;
        this._timeout = 0; //ms
        this.abortController = new AbortController();
        this.abort = function (reason) { return _this.abortController.abort(reason || 'manually aborted'); };
        this.signal = this.abortController.signal;
        this.sequence = 0;
        this.reset = function () {
            _this._isAborted = false;
            _this._isFinished = false;
            _this._isRejected = false;
            _this._isRunning = false;
            _this._startTime = 0;
            _this._stopTime = 0;
            _this._duration = 0;
            _this.sequence = 0;
            _this.abortController = new AbortController();
            _this.signal = _this.abortController.signal;
            _this.abort = function (reason) { return _this.abortController.abort(reason || 'manually aborted'); };
        };
        this['promiseStatus'] = {
            status: 'not started',
            reason: undefined,
            value: undefined,
        };
        var logger = ((_a = this.group) === null || _a === void 0 ? void 0 : _a.logger) || new Logger();
        if (typeof arg === 'object') {
            this.f = function () {
                var result = arg.f();
                return result instanceof Promise ? result : Promise.resolve(result);
            };
            this.name = arg.name;
            this.parent = arg.parent;
            this.child = arg.child;
            this.onStartCallback = function () {
                this._isRunning = true;
                this._startTime = now();
                if (logger.useLogger)
                    logger.log("\u2500\u2500\"".concat(this.name, "\" has started."));
                if (arg.onStartCallback)
                    arg.onStartCallback();
            };
            this.onCompleteCallback = function () {
                this._isFinished = true;
                this._isRunning = false;
                this._stopTime = now();
                this._duration = calcDuration(this._startTime, this._stopTime);
                if (logger.useLogger)
                    logger.log("\u2500\u2500\"".concat(this.name, "\" has completed."));
                if (arg.onCompleteCallback)
                    arg.onCompleteCallback();
            };
            this.onRejectCallback = function () {
                if (this._isAborted) {
                    return;
                }
                this._isRejected = true;
                this._isRunning = false;
                this._stopTime = now();
                this._duration = calcDuration(this._startTime, this._stopTime);
                if (logger.useLogger)
                    logger.warn("\u2500\u2500\"".concat(this.name, "\" was rejected."));
                if (arg.onRejectCallback)
                    arg.onRejectCallback();
            };
            this.onAbortCallback = function () {
                if (this._isFinished)
                    return;
                if (!this._isAborted) {
                    arg.onAbortCallback && arg.onAbortCallback();
                    this.group.onAbortCallback && this.group.onAbortCallback();
                }
                this._isAborted = true;
                this._isRunning = false;
                this._stopTime = now();
                this._duration = calcDuration(this._startTime, this._stopTime);
                if (logger.useLogger)
                    logger.warn("\u2500\u2500\"".concat(this.name, "\" was aborted."));
            };
        }
        else {
            this.f = function () {
                var result = arg();
                return result instanceof Promise ? result : Promise.resolve(result);
            };
            this.name = name;
            this.parent = parent;
            this.child = child;
            if (onStartCallback)
                this.onStartCallback = function () {
                    this._isRunning = true;
                    this._startTime = now();
                    if (logger.useLogger)
                        logger.log("\"".concat(this.name, "\" has started."));
                    onStartCallback();
                };
            if (onCompleteCallback)
                this.onCompleteCallback = function () {
                    this._isFinished = true;
                    this._isRunning = false;
                    this._stopTime = now();
                    this._duration = calcDuration(this._startTime, this._stopTime);
                    if (logger.useLogger)
                        logger.log("\"".concat(this.name, "\" has completed."));
                    onCompleteCallback();
                };
            if (onRejectCallback)
                this.onRejectCallback = function () {
                    this._isRejected = true;
                    this._isRunning = false;
                    this._stopTime = now();
                    this._duration = calcDuration(this._startTime, this._stopTime);
                    if (logger.useLogger)
                        logger.warn("\"".concat(this.name, "\" was rejected."));
                    onRejectCallback();
                };
            if (onAbortCallback)
                this.onAbortCallback = function () {
                    if (this._isFinished)
                        return;
                    this._isAborted = true;
                    this._isRunning = false;
                    this._stopTime = now();
                    this._duration = calcDuration(this._startTime, this._stopTime);
                    if (logger.useLogger)
                        logger.warn("\"".concat(this.name, "\" was aborted d."));
                    self.onAbortCallback && self.onAbortCallback();
                };
        }
        var self = this;
        var originalFunction = this.f;
        this.f = function () {
            return new Promise(function (resolve, reject) {
                self.signal.addEventListener('abort', function (signal) {
                    if (!self._isRunning)
                        return;
                    self.onAbortCallback && self.onAbortCallback();
                    reject((signal.currentTarget && signal.currentTarget.reason) || 'manually aborted.');
                });
                if (_this.timeout > 0) {
                    setTimeout(function () {
                        if (self._isRunning) {
                            logger.error("\"".concat(self.name, "\" has timed out."));
                            self.abort('function timeout');
                        }
                    }, _this.timeout);
                }
                var result = originalFunction();
                if (result instanceof Promise) {
                    result.then(resolve).catch(reject);
                }
                else {
                    resolve(result);
                }
            });
        };
    }
    Object.defineProperty(WatchFunction.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "isAborted", {
        get: function () {
            return this._isAborted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "isFinished", {
        get: function () {
            return this._isFinished;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "isRejected", {
        get: function () {
            return this._isRejected;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "isRunning", {
        get: function () {
            return this._isRunning;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "isProcessed", {
        get: function () {
            return this._isFinished || this._isRejected || this._isAborted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "stopTime", {
        get: function () {
            return this._stopTime;
        },
        set: function (value) {
            this._stopTime = value;
            this._duration = calcDuration(this._startTime, this._stopTime);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "duration", {
        get: function () {
            return Math.min(0, this._duration);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "timeout", {
        get: function () {
            return this._timeout;
        },
        set: function (value) {
            this._timeout = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(WatchFunction.prototype, "metrics", {
        get: function () {
            return {
                id: this._id,
                name: this.name || '',
                start: Math.max(0, this.group ? this._startTime - this.group.startTime : 0),
                duration: this._duration,
                status: this.promiseStatus.status,
                value: this.promiseStatus.value,
                reason: this.promiseStatus.reason,
                isRunning: this._isRunning,
                isFinished: this._isFinished,
                isRejected: this._isRejected,
                isAborted: this._isAborted,
                sequence: this.sequence,
            };
        },
        enumerable: false,
        configurable: true
    });
    return WatchFunction;
}());

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var regexRepeat = function (repeat) {
    var length = repeat.toString().length;
    return new RegExp("\\s{".concat(length, "}1\\/").concat(repeat, "\\s"));
};
var Group = /** @class */ (function () {
    function Group(options) {
        if (options === void 0) { options = { repeat: 0 }; }
        var _this = this;
        this.options = { repeat: 0, runs: 0 };
        this._id = Sequence.nextId();
        this._functions = [];
        this._startTime = 0;
        this._stopTime = 0;
        this._duration = 0;
        this._timeout = 0;
        this._onStartCallback = function () { };
        this._onStartRunCallback = function () { };
        this._onCompleteCallback = function () { };
        this._onCompleteRunCallback = function () { };
        this._onRejectCallback = function () { };
        this._onRejectRunCallback = function () { };
        this._onAbortCallback = function () { };
        this._onAbortRunCallback = function () { };
        this.sequence = 0; //??
        this._onErrorCallback = function () { };
        // Add a watch function
        this.addWatch = function (addWatchFunction) {
            var watchFunction;
            if (typeof addWatchFunction === 'function') {
                // Handle function
                watchFunction = new WatchFunction({
                    f: addWatchFunction,
                    name: "watch-function-".concat(_this.sequence + 1),
                    parent: _this.sequence === 0 ? undefined : "_monitor_".concat(_this.sequence),
                    child: "_monitor_".concat(_this.sequence + 1),
                    onStartCallback: function () { },
                    onCompleteCallback: function () { },
                    onRejectCallback: function () { },
                    onAbortCallback: function () { },
                });
                _this.sequence++;
            }
            else {
                // Handle object
                watchFunction = new WatchFunction(addWatchFunction);
            }
            // Assign an AbortController to the watch function
            watchFunction.group = _this;
            _this._functions.push(watchFunction);
        };
        this.options = __assign(__assign({}, options), { runs: 0 });
        this.logger = new Logger();
        asyncMonitor.push(this);
    }
    Object.defineProperty(Group.prototype, "run", {
        get: function () {
            return this.options.repeat >= 0 ? this.options.runs : 0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "useLogger", {
        get: function () {
            return this.logger.useLogger;
        },
        set: function (value) {
            this.logger.useLogger = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "functions", {
        get: function () {
            return this._functions;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "isRunning", {
        get: function () {
            return this._functions.some(function (fn) { return fn.isRunning; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "isFinished", {
        get: function () {
            return this._functions.every(function (fn) { return fn.isFinished; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "isRejected", {
        get: function () {
            return this._functions.some(function (fn) { return fn.isRejected; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "isAborted", {
        get: function () {
            return this._functions.some(function (fn) { return fn.isAborted; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "isProcessed", {
        get: function () {
            return this.isFinished || this.isRejected || this.isAborted;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "startTime", {
        get: function () {
            return this._startTime;
        },
        set: function (value) {
            this._startTime = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "stopTime", {
        get: function () {
            return this._stopTime;
        },
        set: function (value) {
            this._stopTime = value;
            this._duration = calcDuration(this._startTime, this._stopTime);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "duration", {
        get: function () {
            return Math.min(0, this._duration);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "timeout", {
        get: function () {
            return this._timeout;
        },
        set: function (value) {
            this._timeout = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onStartCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a;
                _this.startTime = now();
                if (_this.options.repeat > 0) {
                    _this.options.runs = 1;
                }
                if (_this.useLogger) {
                    _this.logger.log("*** START \"".concat((_a = _this.name) !== null && _a !== void 0 ? _a : 'Group#' + _this.id, "\" ***"));
                }
                _this.logger.highlight('completed', { id: _this._id }, 'start');
                _this.logger.highlight(regexRepeat(_this.options.repeat), { id: _this._id }, ['start', 'repeat']);
                _this._onStartCallback();
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onStartCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onStartRunCallback", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.isRunning)
                    return;
                if (_this.useLogger) {
                    _this.logger.log("*** RUN \"".concat(_this.run, "\" STARTED ***"));
                }
                _this._onStartRunCallback();
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onStartRunCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onCompleteCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a;
                _this._onCompleteCallback();
                _this.stopTime = now();
                if (_this.useLogger) {
                    _this.logger.log("*** COMPLETED \"".concat((_a = _this.name) !== null && _a !== void 0 ? _a : 'Group#' + _this.id, "\" ***"));
                }
                _this.logger.highlight('completed', { id: _this._id }, 'complete');
                _this.logger.highlight(' ' + _this.options.repeat + '/' + _this.options.repeat + ' ', { id: _this._id }, ['complete']);
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onCompleteCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onCompleteRunCallback", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.useLogger) {
                    _this.logger.log("*** RUN \"".concat(_this.run, "\" COMPLETED ***"));
                }
                _this._onCompleteRunCallback();
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onCompleteRunCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onRejectCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a, _b;
                _this.stopTime = now();
                if (_this.useLogger) {
                    _this.logger.log("*** REJECTED \"".concat((_a = _this.name) !== null && _a !== void 0 ? _a : 'Group#' + _this.id, "\" ***"));
                    _this.logger.log(_this.metrics);
                }
                _this.logger.highlight('completed', { id: _this._id, index: _this.sequence }, 'complete');
                (_b = _this._onRejectCallback) === null || _b === void 0 ? void 0 : _b.call(_this);
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onRejectCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onRejectRunCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a;
                _this.stopTime = now();
                if (_this.useLogger) {
                    _this.logger.log("*** REJECTED RUN \"".concat(_this.run, "\" ***"));
                    _this.logger.log(_this.metrics);
                }
                _this.logger.highlight('completed', { id: _this._id, index: _this.sequence }, 'complete');
                (_a = _this._onRejectRunCallback) === null || _a === void 0 ? void 0 : _a.call(_this);
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onRejectRunCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onAbortCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a;
                _this.stopTime = now();
                if (_this.isAborted)
                    return;
                if (_this.useLogger) {
                    _this.logger.log("*** ABORTED GROUP \"".concat((_a = _this.name) !== null && _a !== void 0 ? _a : 'Group#' + _this.id, "\" ***"));
                }
                _this.logger.highlight('completed', { id: _this._id }, 'aborted');
                if (typeof _this._onAbortCallback === 'function') {
                    _this._onAbortCallback();
                }
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onAbortCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onAbortRunCallback", {
        get: function () {
            var _this = this;
            return function () {
                var _a;
                _this.stopTime = now();
                if (_this.useLogger) {
                    _this.logger.log("*** ABORTED RUN \"".concat(_this.run, "\" ***"));
                }
                _this.logger.highlight('completed', { id: _this._id }, 'aborted');
                (_a = _this._onAbortRunCallback) === null || _a === void 0 ? void 0 : _a.call(_this);
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onAbortRunCallback = value.bind(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "onErrorCallback", {
        get: function () {
            var _this = this;
            return function () {
                if (_this.useLogger) {
                    _this.logger.log("*** ERROR in group \"".concat(_this.name || _this._id, "\" ***"));
                }
                _this._onErrorCallback();
            };
        },
        set: function (value) {
            if (typeof value === 'function')
                this._onErrorCallback = value;
        },
        enumerable: false,
        configurable: true
    });
    // Abort a specific watch function by name
    Group.prototype.abortWatch = function (name) {
        var watchFunction = this._functions.find(function (fn) { return fn.name === name; });
        if (watchFunction) {
            watchFunction.abort('manual aborted by user');
        }
        else {
            if (this.logger.useLogger) {
                this.logger.warn("+++ No watch function found with name \"".concat(name, "\""));
            }
        }
    };
    // Abort the entire group
    Group.prototype.abort = function (reason) {
        if (reason === void 0) { reason = 'all functions aborted by user'; }
        this._functions.forEach(function (fn) {
            fn.abort(reason);
        });
    };
    // Reset all watch functions in the group
    Group.prototype.reset = function (resetRuns) {
        if (resetRuns === void 0) { resetRuns = true; }
        this.startTime = 0;
        this.stopTime = 0;
        this._functions.forEach(function (fn) { return fn.reset(); });
        if (resetRuns) {
            this.options.runs = 1;
        }
        this.logger.displayRepeat(this._id, this.options.runs || 0, this.options.repeat);
        this.logger.clearHighlights(this._id);
    };
    Group.prototype.removeAll = function () {
        this._functions = [];
    };
    Group.prototype.add = function () { };
    Group.prototype.remove = function () { };
    Group.prototype.watchAll = function () {
        var _this = this;
        if (this.logger.addToDocument())
            this.logger.log(this.loggerTree, ['tree', "tree-".concat(this.id)]);
        if (this.timeout > 0) {
            setTimeout(function () {
                _this.logger.warn('timeout on group');
                _this.abort('timeout on group');
            }, this.timeout);
        }
        if (this.functions.length === 0) {
            if (this.logger.useLogger) {
                this.logger.warn('No watch functions found in this group.');
            }
            return new Promise(function (resolve, reject) {
                reject('No watch functions found in this group.');
            });
        }
        if (this.isProcessed) {
            if (this.logger.useLogger) {
                this.logger.warn('This watchAll group has already been processed.');
            }
            return new Promise(function (resolve, reject) {
                reject('This watchAll group has already been processed.');
            });
        }
        if (this.isRunning) {
            if (this.logger.useLogger) {
                this.logger.warn('This watchAll group is already being monitored.');
            }
            return new Promise(function (resolve, reject) {
                reject('This watchAll group is already being monitored.');
            });
        }
        this.startTime = now();
        if (typeof this.onStartCallback === 'function')
            this.onStartCallback();
        return watchAll(this);
    };
    Object.defineProperty(Group.prototype, "loggerTree", {
        get: function () {
            var treeData = this._functions.map(function (f) {
                return { name: f.name, parent: f.parent, child: f.child };
            });
            var treeBuilder = new Tree({ repeat: this.options.repeat });
            return treeBuilder.processTree(treeData);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "metrics", {
        get: function () {
            return this._functions.map(function (f) {
                return f.metrics;
            });
        },
        enumerable: false,
        configurable: true
    });
    return Group;
}());

var nextId = Sequence.nextId;
// Create the asyncMonitor array
var asyncMonitor = [];
// Attach asyncMonitor to the global window object
window.asyncMonitor = asyncMonitor;
// Export types and interfaces.
// Use default export if necessary
var Index = {
    Group: Group,
    Logger: Logger,
    Monitor: Monitor,
    nextId: nextId,
    Sequence: Sequence,
    sleep: sleep,
    Tree: Tree,
    version: version,
    Watch: Watch,
    WatchFunction: WatchFunction,
};

exports.Group = Group;
exports.Logger = Logger;
exports.Monitor = Monitor;
exports.Sequence = Sequence;
exports.Tree = Tree;
exports.Watch = Watch;
exports.WatchFunction = WatchFunction;
exports.asyncMonitor = asyncMonitor;
exports.default = Index;
exports.nextId = nextId;
exports.sleep = sleep;
exports.version = version;
