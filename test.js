import test from 'ava';
import promisify from './';
import Firebase from 'firebase';

test('async methods', t => {
	function FirebaseStub(exists) {
		this.once = (type, fn) => {
			t.ok(type === 'value');
			setImmediate(() => fn({
				exists: () => exists
			}))
		};
	}

	promisify(FirebaseStub.prototype);

	var obj = new FirebaseStub(true);

	// uncomment the following and nyc is broken:

	// new Firebase('https://test.firebaseio.test');

	obj.exists().then(exists => {
		t.ok(exists === true);
		t.end();
	});
});

