const { getArticleById, patchArticleById, getArticles } = require('../model/articles-model.js');

const sendGetArticleById = (req, res, next) => {
	getArticleById(req.params)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const sendPatchArticleById = (req, res, next) => {
	patchArticleById(req.params, req.body)
		.then((article) => {
			res.status(200).send({ article });
		})
		.catch(next);
};

const sendGetArticles = (req, res, next) => {
	getArticles(req.query).then((articles) => {
		res.status(200).send({ articles });
	});
};

module.exports = { sendGetArticleById, sendPatchArticleById, sendGetArticles };
