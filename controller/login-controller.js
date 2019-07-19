const { insertLogin } = require('../model/login-model.js');

const postLogin = (req, res, next) => {
	insertLogin(req.body)
		.then(({ ...passedObj }) => {
			res.status(201).send({ ...passedObj });
		})
		.catch(next);
};

module.exports = { postLogin };
