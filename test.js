import test from 'ava';
import promisify from './';
import Firebase from 'firebase';

Firebase.goOffline();

promisify(Firebase.prototype, true);

function baseRef() {
	return new Firebase('https://test.firebaseio.test');
}

test('async methods', async t => {
	t.plan(15);
	var ref = baseRef();
	ref.set(null);
	ref.child('a').setWithPriority('b', 3);

	t.ok(await ref.child('a').exists() === true);
	t.ok(await ref.child('b').exists() === false);

	t.same(await ref.val(), {a: 'b'});
	t.ok(await ref.child('a').val() === 'b');

	t.ok(await ref.hasChild('a') === true);
	t.ok(await ref.hasChild('b') === false);

	t.ok(await ref.hasChildren() === true);
	t.ok(await ref.child('a').hasChildren() === false);

	t.ok(await ref.numChildren() === 1);
	t.ok(await ref.child('a').numChildren() === 0);

	t.ok(await ref.getPriority() === null);
	t.ok(await ref.child('a').getPriority() === 3);

	t.same(await ref.exportVal(), {a: {'.value': 'b', '.priority': 3}});
	t.same((await ref.snap()).exportVal(), {a: {'.value': 'b', '.priority': 3}});
	t.same(await ref.child('a').exportVal(), {'.value': 'b', '.priority': 3});
});

test('sync methods', t => {
	t.plan(15);
	var ref = baseRef();
	ref.set(null);
	ref.child('a').setWithPriority('b', 3);

	t.ok(ref.child('a').existsSync() === true);
	t.ok(ref.child('b').existsSync() === false);

	t.same(ref.valSync(), {a: 'b'});
	t.ok(ref.child('a').valSync() === 'b');

	t.ok(ref.hasChildSync('a') === true);
	t.ok(ref.hasChildSync('b') === false);

	t.ok(ref.hasChildrenSync() === true);
	t.ok(ref.child('a').hasChildrenSync() === false);

	t.ok(ref.numChildrenSync() === 1);
	t.ok(ref.child('a').numChildrenSync() === 0);

	t.ok(ref.getPrioritySync() === null);
	t.ok(ref.child('a').getPrioritySync() === 3);

	t.same(ref.exportValSync(), {a: {'.value': 'b', '.priority': 3}});
	t.same(ref.snapSync().exportVal(), {a: {'.value': 'b', '.priority': 3}});
	t.same(ref.child('a').exportValSync(), {'.value': 'b', '.priority': 3});
});

