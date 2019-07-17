const { getUserByUsername } = require('../model/users-model.js');

const sendUserByUsername = (req, res, next) => {
	getUserByUsername(req.params)
		.then((user) => {
			res.status(200).send({ user });
		})
		.catch(next);
};

module.exports = { sendUserByUsername };
