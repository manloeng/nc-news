const { expect } = require('chai');
const { formatDates, makeRefObj, formatComments } = require('../db/utils/utils');

describe('formatDates', () => {
	it('returns empty array when passed with an empty array', () => {
		const input = [];
		const expected = formatDates(input);
		expect(expected).to.eql([]);
	});
	it('returns the converted date when passed a Unix timestamp of 0', () => {
		const input = [ { created_at: 0 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(0) } ]);
	});
	it('returns the converted date when passed a Unix timestamp', () => {
		const input = [ { created_at: 1563188900 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(1563188900) } ]);
	});
	it('returns the converted date when passed with multiple Unix timestamp in an array', () => {
		const input = [ { created_at: 0 }, { created_at: 1563188900 } ];
		const expected = formatDates(input);
		expect(expected).to.eql([ { created_at: new Date(0) }, { created_at: new Date(1563188900) } ]);
	});
	it('returns the converted date when passed with multiple keys value pairs and the Unix timestamp in an array', () => {
		const input = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			}
		];
		const result = formatDate(input);
		expect(result[0]).to.contain.keys('title', 'topic', 'author', 'body', 'created_at');
	});
});

describe('makeRefObj', () => {});

describe('formatComments', () => {});
