const { insertLogin } = require('../model/login-model.js');

const postLogin = (req, res, next) => {
	//may need to add extra for login
	insertLogin(req.body)
		.then(({ ...passedObj }) => {
			res.status(200).send({ ...passedObj });
		})
		.catch(next);
};

module.exports = { postLogin };
