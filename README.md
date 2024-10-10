# async-monitor.js

![Build and Deployment](https://github.com/manulykebe/async-monitor.js/actions/workflows/pages/pages-build-deployment/badge.svg?branch=main)
![Code Scanning](https://github.com/manulykebe/async-monitor.js/actions/workflows/github-code-scanning/codeql/badge.svg?branch=main)

[![NPM Version][npm-image]][npm-url]

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
	watches.WatchAll();
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
