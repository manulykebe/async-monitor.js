import {sleep} from './Sleep';
import Group, {type WatchFunction} from './Group';
import now from './Now';
import Sequence from './Sequence';
import Tree from './Tree';
import Monitor from './Monitor';
import version from './Version';
import {mainGroup} from './mainGroup';
import {Watch} from './Watch';

const nextId = Sequence.nextId;

const MONITOR = mainGroup;

const getAll = MONITOR.getAll.bind(MONITOR);
const removeAll = MONITOR.removeAll.bind(MONITOR);
const add = MONITOR.add.bind(MONITOR);
const remove = MONITOR.remove.bind(MONITOR);

// Directly export the items as named exports
export {Group, now, Sequence, nextId, Monitor, version, getAll, removeAll, add, remove, Watch, sleep, Tree};
// Export types and interfaces.
export {WatchFunction};

// Use default export if necessary
export default {
	Group,
	now,
	Sequence,
	nextId,
	Monitor,
	version,
	getAll,
	removeAll,
	add,
	remove,
	Watch,
	sleep,
	Tree,
};
