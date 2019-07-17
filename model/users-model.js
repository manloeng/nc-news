const connection = require('../db/connection.js');

const getUserByUsername = ({ username }) => {
	const reg = /([A-Z])\w+/i;

	if (!reg.test(username)) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

	return connection.first('*').from('users').where('username', username).then((user) => {
		if (!user) {
			return Promise.reject({
				status: 404,
				msg: 'User Not Found'
			});
		}
		return user;
	});
};

module.exports = { getUserByUsername };
