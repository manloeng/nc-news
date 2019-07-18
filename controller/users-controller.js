const { getUserByUsername, insertUser, getUsers } = require('../model/users-model.js');

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

const sendUser = (req, res, next) => {
	getUsers()
		.then((users) => {
			res.status(200).send({ users });
		})
		.catch(next);
};

module.exports = { sendUserByUsername, postUser, sendUser };
