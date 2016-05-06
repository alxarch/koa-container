'use strict';

const assert = require('assert');
const Container = require('.');


const cnt = new Container({foo: 'bar'});
assert.equal(cnt.get('foo'), 'bar');

// Container#setdefault()
assert.equal(cnt.setdefault('foo', 'baz'), 'bar');
assert.equal(cnt.setdefault('foo.bar', 'baz'), 'baz');
assert.equal(cnt.get('foo.bar'), 'baz');

// Container#register()

assert.doesNotThrow(() => {
	cnt.register(function (c) {});
});

cnt.register(function (c) {
	c.set('bar', 'baz');
});

assert.equal(cnt.get('bar'), 'baz');

cnt.register(function (c) {
	c.set('baz', 'bar');
}, { baz: 'foo' });

assert.equal(cnt.get('baz'), 'foo');

function *middleware (next) {
	yield next;
}
cnt.register({ run: (c => middleware) });
assert.equal(cnt.middleware[0], middleware);
