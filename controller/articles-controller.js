const { getArticleById } = require('../model/articles-model.js');

const sendGetArticleById = (req, res, next) => {
	getArticleById(req.params)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

module.exports = { sendGetArticleById };
