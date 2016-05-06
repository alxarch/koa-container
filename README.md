# koa-container

Dependency injection container with twist of koa-compose

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
