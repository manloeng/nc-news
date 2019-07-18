const connection = require('../db/connection.js');

const getTopics = () => {
	return connection.select('*').from('topics');
};

const insertTopics = ({ slug, description, ...restOfReqBody }) => {
	const reg = /([A-Z])\w+/i;
	if (
		// Checks for extra invalid queries
		Object.keys(restOfReqBody).length > 0 ||
		// Checks for invalid slug format (i.e Int)
		!reg.test(slug)
	) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

	const formattedBody = { slug, description };
	return connection.insert(formattedBody).into('topics').returning('*').then((topic) => topic[0]);
};

module.exports = { getTopics, insertTopics };
