# async-monitor.js

![Build and Deployment](https://github.com/manulykebe/async-monitor.js/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)
![Code Scanning](https://github.com/manulykebe/async-monitor.js/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)

[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

```html
<script type="module">
	import {Group} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js';

	const watches = new Group();

	const function_to_watch1 = () => sleep(5, /*fail:*/ false);
	const function_to_watch2 = () => sleep(2, /*fail:*/ false);

	watches.addWatch({
		parent: undefined,
		child: 'a',
		f: function_to_watch1,
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback() after step 1');
		},
	});

	watches.addWatch({
		parent: 'a',
		child: 'b',
		f: function_to_watch2,
		onCompleteCallback: function () {
			console.log('++++onCompleteCallback() after step 2');
		},
	});

	watches.WatchAll();
</script>
```

[Examples](https://manulykebe.github.io/async-monitor.js/src/HTML/index.html)
[CodePen](https://codepen.io/codepenatlykebe/pen/gOVPBEg)

# Features

A lightweight and efficient monitoring engine designed to seamlessly track and manage hierarchically organized asynchronous JavaScript functions. Perfect for developers looking to streamline and gain insights into complex async workflows, ensuring reliable performance and easy debugging.

# Examples

# Work in progress!

# Tests

```bash
npm install
```

To run the tests run:

```bash
npm test
```

If you want to add any feature or change existing features, you _must_ run the
tests to make sure you didn't break anything else. Any pull request (PR) needs
to have updated passing tests for feature changes (or new passing tests for new
features or fixes) in `src/<file>.test.ts` to be accepted. See

# People

Maintainers: [Manu Vanneste](https://github.com/manulykebe).

[npm-image]: https://badge.fury.io/js/async-monitor.js.svg
[npm-url]: https://www.npmjs.com/package/async-monitor.js
