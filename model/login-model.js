const connection = require('../db/connection.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config.js');

const insertLogin = ({ username, password, ...restOfReqBody }) => {
	const formattedBody = { username, password };
	return connection.insert(formattedBody).into('users').returning('*').then((user) => {
		const token = jwt.sign({ user: user.username, iat: Date.now() }, JWT_SECRET);
		return { token, user: user[0] };
	});
	// return connection.select('*').from('users').where('username', '=', username).then(([ user ]) => {
	// 	console.log(user);
	// 	if (!user || password !== user.password)
	// 		return Promise.reject({ status: 401, msg: 'invalid username or password' });
	// 	else {
	// 		    const token = jwt.sign(
	//     { user: user.username, iat: Date.now() },
	//     JWT_SECRET
	// );
	// res.send({ token });
	// 	}
	// });
};

module.exports = { insertLogin };
