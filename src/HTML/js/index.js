import {Monitor, Group, sleep, version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';

const div_version = document.getElementById('version');
div_version.innerText = version;

const monitor = new Monitor();
console.log(monitor);
const watches = new Group();

watches.addWatch({
	parent: undefined,
	child: undefined,
	f: sleep(),
	onCompleteCallback: function () {
		console.log('++++onCompleteCallback() after step 1');
	},
});

console.log(watches);

watches.WatchAll();
