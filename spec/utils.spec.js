const { expect } = require('chai');
const { formatDates, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDates', () => {
	it('returns empty array when passed with an empty array', () => {
		const input = [];
		const expected = formatDates(input);
		expect(expected).to.eql([]);
	});
	it('returns empty array when passed with an empty array', () => {
		const input = [ { created_at: 0 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(0) } ]);
	});
	it('returns empty array when passed with an empty array', () => {
		const input = [ { created_at: 1563188900 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(1563188900) } ]);
	});
	it('returns empty array when passed with an empty array', () => {
		const input = [ { created_at: 0 }, { created_at: 1563188900 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(0) }, { created_at: new Date(1563188900) } ]);
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
