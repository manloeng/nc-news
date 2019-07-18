const { getArticleById, updateArticleById, getArticles, insertArticles } = require('../model/articles-model.js');

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

const postArticles = (req, res, next) => {
	insertArticles(req.body)
		.then((article) => {
			res.status(201).send({ article });
		})
		.catch(next);
};

module.exports = { sendArticleById, patchArticleById, sendArticles, postArticles };
