const {
	getArticleById,
	updateArticleById,
	getArticles,
	insertArticles,
	totalArticleCount,
	destroyArticleById
} = require('../model/articles-model.js');

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
	const total_count = totalArticleCount(req.query);
	const articles = getArticles(req.query);

	return Promise.all([ total_count, articles ])
		.then(([ total_count, articles ]) => {
			res.status(200).send({ total_count, articles });
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

const deleteArticleById = (req, res, next) => {
	destroyArticleById(req.params)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports = { sendArticleById, patchArticleById, sendArticles, postArticles, deleteArticleById };
