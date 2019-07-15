const { expect } = require('chai');
const { formatDates, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDates', () => {
	it('returns empty array when passed with an empty array', () => {
		const input = [];
		const expected = formatDates(input);
		expect(expected).to.eql([]);
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
