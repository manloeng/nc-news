const connection = require('../db/connection.js');

const getTopics = () => {
	return connection.select('*').from('topics');
};

module.exports = { getTopics };
