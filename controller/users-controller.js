const { getUserByUsername, insertUser } = require('../model/users-model.js');

const sendUserByUsername = (req, res, next) => {
	getUserByUsername(req.params)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

const postUser = (req, res, next) => {
	insertUser(req.body)
		.then((user) => {
			res.status(201).send({ user });
		})
		.catch(next);
};

module.exports = { sendUserByUsername, postUser };
