import './Logger';

import {sleep} from './Sleep';
import Group from './Group';
import Sequence from './Sequence';
import Tree from './Tree';
import Monitor from './Monitor';
import version from './Version';
import {Watch} from './Watch';
import WatchFunction from './WatchFunction';
import Logger from './Logger';

const nextId = Sequence.nextId;
// Create the asyncMonitor array
export const asyncMonitor: Group[] = [];
// Attach asyncMonitor to the global window object
(window as any).asyncMonitor = asyncMonitor;
// Directly export the items as named exports
export {Group, Logger, Sequence, nextId, Monitor, version, Watch, sleep, Tree, WatchFunction};
// Export types and interfaces.

// Use default export if necessary
export default {
	Group,
	Logger,
	Monitor,
	nextId,
	Sequence,
	sleep,
	Tree,
	version,
	Watch,
	WatchFunction,
};
