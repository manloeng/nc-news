const { getUserByUsername, insertUser } = require('../model/users-model.js');

const sendUserByUsername = (req, res, next) => {
	getUserByUsername(req.params)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

const postUser = (req, res, next) => {
	console.log('postUser');
	insertUser();
};

module.exports = { sendUserByUsername, postUser };
