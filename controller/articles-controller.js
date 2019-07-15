const { getArticleById } = require('../model/articles-model.js');

const sendGetArticleById = (req, res, next) => {
	getArticleById(req.params)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

module.exports = { sendGetArticleById };
