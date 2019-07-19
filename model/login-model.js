const connection = require('../db/connection.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

const insertLogin = ({ username, password, ...restOfReqBody }) => {
	//password hardcoded for now
	// console.log(password);
	return connection.select('*').from('users').where('username', username).then(([ user ]) => {
		if (!user || password !== 'secure123') {
			return Promise.reject({ status: 401, msg: 'invalid username or password' });
		} else {
			const token = jwt.sign({ user: user.username, iat: Date.now() }, JWT_SECRET);
			return { token, user };
		}
	});
};

module.exports = { insertLogin };
