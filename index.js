'use strict';

module.exports = promisify;

var Promise = require('native-or-bluebird');

var PROXIED_METHODS = ['exists', 'val', 'hasChild', 'hasChildren', 'numChildren', 'getPriority', 'exportVal'];

function promisify(proto, addSync, accessor) {
	if (typeof addSync === 'function') {
		accessor = addSync;
		addSync = false;
	}

	PROXIED_METHODS.forEach(function (methodName) {
		addMethod(methodName);
	});

	addMethod(null, 'snap');

	function addMethod(methodOnSnap, methodOnProto) {
		methodOnProto = methodOnProto || methodOnSnap;
		proto[methodOnProto] = makeAsyncMethod(methodOnSnap, accessor);
		if (addSync) {
			proto[methodOnProto + 'Sync'] = makeSyncMethod(methodOnSnap, accessor);
		}
	}
}

function makeAsyncMethod(methodOnSnap, accessor) {
	accessor = accessor || thisAccessor;

	return function () {
		var args = methodOnSnap && Array.prototype.slice.call(arguments);
		var ref = accessor.call(this);
		return new Promise(function (resolve, reject) {
			ref.once('value', function (snap) {
				try {
					var result = methodOnSnap ? snap[methodOnSnap].apply(snap, args) : snap;
					resolve(result);
				} catch (e) {
					reject(e);
				}
			}, reject);
		});
	};
}

function makeSyncMethod(methodOnSnap, accessor) {
	accessor = accessor || thisAccessor;

	return function () {
		var args = methodOnSnap && Array.prototype.slice.call(arguments);
		var called = false;
		var value;
		var ref = accessor.call(this);

		ref.once('value',
			function (snap) {
				called = true;
				value = methodOnSnap ? snap[methodOnSnap].apply(snap, args) : snap;
			},
			function (err) {
				throw err;
			}
		);

		if (!called) {
			throw new Error('value listener was not called synchronously');
		}

		return value;
	};
}

function thisAccessor() {
	return this;
}
