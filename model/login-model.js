const connection = require('../db/connection.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

const insertLogin = ({ username, password, ...restOfReqBody }) => {
	const formattedBody = { username, password };
	return connection.insert(formattedBody).into('users').returning('*').then((user) => {
		const token = jwt.sign({ user: user.username, iat: Date.now() }, JWT_SECRET);
		return { token, user: user[0] };
	});
};

module.exports = { insertLogin };
