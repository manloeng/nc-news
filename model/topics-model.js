const connection = require('../db/connection.js');

const getTopics = () => {
	return connection.select('*').from('topics');
};

const insertTopics = (reqBody) => {
	return connection.insert(reqBody).into('topics').returning('*').then((topic) => topic[0]);
};

module.exports = { getTopics, insertTopics };
