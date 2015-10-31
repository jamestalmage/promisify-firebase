'use strict';

module.exports = bigOrSmall;

function bigOrSmall(value) {
	if (value > 100) {
		return 'big';
	}
	return 'small';
}
