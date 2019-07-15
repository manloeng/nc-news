const connection = require('../db/connection.js');

const getUserByUsername = ({ username }) => {
	return connection.first('*').from('users').where('username', username);
};

module.exports = { getUserByUsername };
