async-monitor.js
[![NPM Version][npm-image]][npm-url]
[![CDNJS][cdnjs-image]][cdnjs-url]
[![NPM Downloads][downloads-image]][downloads-url]
[![Build and Tests][ci-image]][ci-url]

```html
<div id="version"></div>
<script type="module">
	import {version} from 'https://manulykebe.github.io/async-monitor.js/dist/async-monitor.esm.js'
	const div_version = document.getElementById('version')
	div_version.innerText = version;
</script>
```
# Features
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
Publishing as NPM package pending...
[npm-image]: https://img.shields.io/npm/v/@asyncmonitorjs/tween.js.svg
[npm-url]: https://npmjs.org/package/@asyncmonitorjs/tween.js
[downloads-image]: https://img.shields.io/npm/dm/@asyncmonitorjs/tween.js.svg
[downloads-url]: https://npmjs.org/package/@asyncmonitorjs/tween.js
[ci-image]: https://github.com/manulykebe/async-monitor.js/workflows/build%20and%20tests/badge.svg?branch=main
[ci-url]: https://github.com/manulykebe/async-monitor.js/actions
[cdnjs-image]: https://img.shields.io/cdnjs/v/asyncmonitor.js.svg
[cdnjs-url]: https://cdnjs.com/libraries/asyncmonitor.js
