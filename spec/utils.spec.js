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
	it('returns the converted date when passed with multiple keys value pairs in an array of a single object', () => {
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
		const result = formatDates(input);
		expect(result[0]).to.contain.keys('title', 'topic', 'author', 'body', 'created_at');
	});
	it('returns the converted date when passed with multiple keys value pairs in an array of multiple objects', () => {
		const input = [
			{
				title: 'Running a Node App',
				topic: 'coding',
				author: 'jessjelly',
				body:
					'This is part two of a series on how to get up and running with Systemd and Node.js. This part dives deeper into how to successfully run your app with systemd long-term, and how to set it up in a production environment.',
				created_at: 1471522072389
			},
			{
				title: "The Rise Of Thinking Machines: How IBM's Watson Takes On The World",
				topic: 'coding',
				author: 'jessjelly',
				body:
					'Many people know Watson as the IBM-developed cognitive super computer that won the Jeopardy! gameshow in 2011. In truth, Watson is not actually a computer but a set of algorithms and APIs, and since winning TV fame (and a $1 million prize) IBM has put it to use tackling tough problems in every industry from healthcare to finance. Most recently, IBM has announced several new partnerships which aim to take things even further, and put its cognitive capabilities to use solving a whole new range of problems around the world.',
				created_at: 1500584273256
			},
			{
				title: '22 Amazing open source React projects',
				topic: 'coding',
				author: 'happyamy2016',
				body:
					'This is a collection of open source apps built with React.JS library. In this observation, we compared nearly 800 projects to pick the top 22. (React Native: 11, React: 11). To evaluate the quality, Mybridge AI considered a variety of factors to determine how useful the projects are for programmers. To give you an idea on the quality, the average number of Github stars from the 22 projects was 1,681.',
				created_at: 1500659650346
			}
		];
		const result = formatDates(input);
		expect(result[0]).to.contain.keys('title', 'topic', 'author', 'body', 'created_at');
	});
});

describe('makeRefObj', () => {
	it('returns empty array when passed with an empty array', () => {
		const input = [];
		const expected = makeRefObj(input);
		expect(expected).to.eql({});
	});
	it('returns a newly created reference object with a single key value pair when passed with an array with a single object', () => {
		let input = [ { article_id: 1, title: 'A' } ];
		let expected = makeRefObj(input);
		expect(expected).to.eql({ A: 1 });
		input = [ { article_id: 2, title: 'B' } ];
		expected = makeRefObj(input);
		expect(expected).to.eql({ B: 2 });
	});
	it('returns a newly created reference object with mutliple key value pair when passed with an array with a multiple objects', () => {
		let input = [ { article_id: 1, title: 'A' }, { article_id: 2, title: 'B' } ];
		let expected = makeRefObj(input);
		expect(expected).to.eql({ A: 1, B: 2 });
	});
	it('returns a newly created reference object with mutliple key value pair when passed with an array with a multiple objects with extra data', () => {
		let input = [
			{ article_id: 1, title: 'A', hope: 'none' },
			{ article_id: 2, title: 'B', hope: 'none', humour: 'some' }
		];
		let expected = makeRefObj(input);
		expect(expected).to.eql({ A: 1, B: 2 });
	});
});

describe('formatComments', () => {
	it('returns empty array when passed with an empty array', () => {
		const input = [];
		const expected = formatComments(input);
		expect(expected).to.eql([]);
	});
	it('returns an array with an renamed key of "author" when passed with a key of "created_by"', () => {
		const comments = [ { created_by: 'Andrew' } ];
		const articleRefObj = { Andrew: 1 };
		const expected = formatComments(comments, articleRefObj);
		expect(expected).to.eql([ { author: 'Andrew' } ]);
	});
	it('returns an array with an renamed key of "article_id" when passed with a key of "belongs_to"', () => {
		const comments = [ { belongs_to: 'Andrew' } ];
		const articleRefObj = { Andrew: 1 };
		const expected = formatComments(comments, articleRefObj);
		expect(expected).to.eql([ { article_id: 1 } ]);
	});
	it('returns an array with an object containing the converted date when passed an array with an object containing a Unix timestamp of 0', () => {
		const comments = [ { created_at: 0 } ];
		const articleRefObj = { Andrew: 1 };
		const expected = formatComments(comments, articleRefObj);
		expect(expected).to.eql([ { created_at: new Date(0) } ]);
	});
	it('returns an array with multiple objects containing the converted date when passed an array with objects containing multiple Unix timestamps', () => {
		const comments = [ { created_at: 0 }, { created_at: 1563188900 } ];
		const articleRefObj = { Andrew: 1 };
		const expected = formatComments(comments, articleRefObj);
		expect(expected).to.eql([ { created_at: new Date(0) }, { created_at: new Date(1563188900) } ]);
	});
	it('returns an array with all the key-value pair in a object including the newly renamed keys when passed with an array containing one object', () => {
		const articleRef = { 'Running away': 22 };
		const input = [
			{
				body:
					'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
				belongs_to: 'Running away',
				created_by: 'tickle122',
				votes: -1,
				created_at: 1468087638932
			}
		];
		const result = formatComments(input, articleRef);
		expect(result[0]).to.have.keys('body', 'article_id', 'author', 'votes', 'created_at');
		expect(result[0].author).to.equal('tickle122');
		expect(result[0].article_id).to.equal(22);
		expect(result[0].created_at).to.eql(new Date(1468087638932));
	});
	it('returns an array with all the key-value pair in the object including the newly renamed keys when passed with an array containing multiple object', () => {
		const articleRef = { 'Running a Node App': 10, 'Running away': 22 };
		const input = [
			{
				body:
					'Itaque quisquam est similique et est perspiciatis reprehenderit voluptatem autem. Voluptatem accusantium eius error adipisci quibusdam doloribus.',
				belongs_to: 'Running away',
				created_by: 'tickle122',
				votes: -1,
				created_at: 1468087638932
			},
			{
				body: 'Some text here',
				belongs_to: 'Running a Node App',
				created_by: 'Andrew',
				votes: -1,
				created_at: 0
			}
		];
		const result = formatComments(input, articleRef);
		expect(result[0]).to.have.keys('body', 'article_id', 'author', 'votes', 'created_at');
		expect(result[1].author).to.equal('Andrew');
		expect(result[1].article_id).to.equal(10);
		expect(result[1].created_at).to.eql(new Date(0));
	});
});
