# async-monitor.js

![Build and Deployment](https://github.com/manulykebe/async-monitor.js/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)
![Code Scanning](https://github.com/manulykebe/async-monitor.js/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)

[![NPM Version][npm-image]][npm-url]

[![Known Vulnerabilities](https://snyk.io/test/npm/async-monitor.js/badge.svg)](https://snyk.io/test/npm/async-monitor.js)
[![Coverage Status](https://coveralls.io/repos/github/manulykebe/async-monitor.js/badge.svg?branch=main)](https://coveralls.io/github/manulykebe/async-monitor.js?branch=main)

```html
(pseudo code)
<script>
	const watches = new Group();
	watches.addWatch({
			parent: undefined,
			child: 'a',
			f: function_to_watch
		});
	...watches.addWatch();
	 console.log(watches.tree);
	watches.watchAll()
	   .then(()=>console.log('All went well!'))
	   .catch(()=>console.log('Oops, at least 1 promise was rejected!'));
</script>
<pre>
── preparation step
   ├─ fetch data from ETL store: s1, fetch data from ETL store: s2
   │  └─ build snowflake s1 and s2
   │     └─ publish snowflake s1 and s2 ───────────────────────────┐
   └─ fetch data from ETL store: s3                                │
      └─ build snowflake from s3                                   │
         └─ publish snowflake s3 ──────────────────────────────────┤
                                                                   └─ completed
</pre>
```

[Examples](https://manulykebe.github.io/async-monitor.js/src/html/index.html)

# Features

A lightweight and efficient monitoring engine designed to seamlessly track and manage hierarchically organized asynchronous JavaScript functions. Perfect for developers looking to streamline and gain insights into complex async workflows, ensuring reliable performance and easy debugging.

## new in v1.1

The `watchAll` function is now an `async` function. This enhancement allows you to nest groups as needed and utilize `then`, `catch`, and `finally` for improved functionality and better control over your asynchronous workflows.

# Examples

Explore various examples showcasing random hierarchies of asynchronous functions, graphically represented for better understanding and visualization. These examples demonstrate the flexibility and robustness of the monitoring engine in handling complex async workflows, making it easier to debug and optimize your code.

For demonstration purposes, an asynchronous function `sleep(seconds, fail)` is used to simulate an async operation. This function helps illustrate how the monitoring engine handles asynchronous tasks.

- `seconds`: The number of seconds to wait before resolving (default is a random number between 0 and 3).
- `fail`: A boolean indicating whether the function should reject (default is `false`). If undefined, there is a 50% chance of rejection.
- `returns`: A promise that resolves after the specified `seconds` or rejects based on the `fail` condition.

In example 'demo04', descriptions ending with double exclamation marks (!!) contain a `sleep` function that is likely to reject. This highlights the monitoring engine's ability to handle and report failed asynchronous operations effectively.

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
