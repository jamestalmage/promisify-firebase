import test from 'ava';
import bigOrSmall from './';
import Firebase from 'firebase';

test('test', t => {

	// uncomment the following and nyc is broken:

	// new Firebase('https://test.firebaseio.test');

	t.ok(bigOrSmall(50) === 'small');
	t.end();
});

