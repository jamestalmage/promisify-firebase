import test from 'ava';
import promisify from './';
import Firebase from 'firebase';

test('async methods', t => {
	t.plan(2);

	function blah(exists) {
		this.once = (type, fn) => {
			t.ok(type === 'value');
			setImmediate(() => fn({
				exists: () => exists
			}))
		};
	}

	promisify(blah.prototype);

	var obj = new blah(true);

	obj.exists().then(exists => t.ok(exists === true));
});

