'use strict';

module.exports = promisify;

function promisify(proto) {
	proto.exists = function () {
		var ref = this;
		return new Promise(function (resolve, reject) {
			ref.once('value', function (snap) {
				var result = snap.exists();
				resolve(result);
			}, reject);
		});
	};
}
