'use strict';

const Jimple = require('jimple');
const co = require('co');
const compose = require('koa-compose');
const pathToRx = require('path-to-regexp');

function isFunction (fn) {
	return fn && fn.constructor && 'Function' === fn.constructor.name;
}
function isGenerator (fn) {
	return fn && fn.constructor && 'GeneratorFunction' === fn.constructor.name;
}

class Container extends Jimple {
	constructor (values) {
		super();
		this.middleware = [];
		for (let key in values) {
			this.set(key, values[key]);
		}
	}

	matchKeys (pattern, values) {
		const params = [];
		const rx = pathToRx(pattern, params);
		return this.keys().reduce((result, key) => {
			const m = rx.exec(key);
			if (m) {
				const match = {key};
				match.params = {};
				for (let i=0; i < params.length; i++) {
					match.params[params[i].name] = m[i + 1];
				}
				if (values) {
					match.value = this.get(key);
				}
				result.push(match);
			}
			return result;
		}, []);
	}

	setdefault (key, value) {
		try {
			return this.get(key);
		}
		catch (err) {
			if (this.has(key)) {
				throw err;
			}
			this.set(key, value);
			return this.get(key);
		}
	}

	use (middleware) {
		if (isFunction(middleware)) {
			middleware = middleware(this);
		}
		if (!isGenerator(middleware)) {
			throw new TypeError('Invalid middleware');
		}
		this.middleware.push(middleware);
		return this;
	}

	register (plugin, params) {
		if (isFunction(plugin)) {
			plugin = {register: plugin};
		}

		if (isFunction(plugin.register)) {
			plugin.register(this);
		}

		if (isFunction(plugin.run) || isGenerator(plugin.run)) {
			this.use(plugin.run);
		}

		if (params) {
			for (let key in params) {
				if (params.hasOwnProperty(key)) {
					this.set(key, params[key]);
				}
			}
		}
	}

	run () {
		return co(compose(this.middleware));
	}
}

module.exports = Container;
