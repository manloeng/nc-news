const { getArticleById, updateArticleById, getArticles } = require('../model/articles-model.js');

const sendArticleById = (req, res, next) => {
	getArticleById(req.params)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const patchArticleById = (req, res, next) => {
	updateArticleById(req.params, req.body)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const sendArticles = (req, res, next) => {
	getArticles(req.query)
		.then(({ ...articles }) => {
			res.status(200).send({ ...articles });
		})
		.catch(next);
};

module.exports = { sendArticleById, patchArticleById, sendArticles };
