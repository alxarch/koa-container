# koa-container

Dependency injection container with twist of koa-compose

Extends [Jimple](https://www.npmjs.com/package/jimple)

## Usage

```js

var Container = require('koa-container');

var c = new Container();

c.register({
	register: (c) => {
		c.set('foo', 'bar');
	},
	run: (c) => {
		return function *(next) {
			console.log('A');
			yield next;
			console.log('B');
		}
	}
});
c.register({
	register: (c) => {
		c.set('foo', 'baz');
	},
	run: (c) => {
		return function *(next) {
			console.log('C');
			yield next;
			console.log('D');
		}
	}
});

c.run().then(() => {
	console.log('done');
});

// Will log
// > A
// > C
// > D
// > B
// > done

```

## Differences with Jimple API

### container.matchKeys(pattern, values)

Use [path-to-regexp](https://www.npmjs.com/package/path-to-regexp) to match keys.

Arguments

  - _pattern_: A key pattern
  - _values_: If true, results will also have a `value` key set to `container.get(key)`

```js
cnt.matchKeys('foo.:bar.:baz?');
```

Returns an `Array` of objects with keys:

  - _key_: key that matched
  - _params_: key parameters as matched by pattern
  - _value_(optional): If `values` is true the result of `container.get(key)`

### container.setdefault(key, value)

Similar to Python's `dict.setdefault(key, value)` method.
It gets the value of a key or sets it to value if not defined.
