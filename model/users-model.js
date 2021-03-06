const connection = require('../db/connection.js');

const getUserByUsername = ({ username }) => {
	const reg = /([A-Z])\w+/i;

	// Checks if username has a valid format
	if (!reg.test(username)) {
		return Promise.reject({
			status: 400,
			msg: 'Require a Valid Query'
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

const insertUser = ({ username, name, avatar_url, ...restOfReqBody }) => {
	const formattedObj = { username, name, avatar_url };
	return connection.insert(formattedObj).into('users').returning('*').then((user) => user[0]);
};

const getUsers = () => {
	return connection.select('*').from('users');
};

module.exports = { getUserByUsername, insertUser, getUsers };
