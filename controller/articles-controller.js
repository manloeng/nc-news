const { getArticleById, patchArticleById } = require('../model/articles-model.js');

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

module.exports = { sendGetArticleById, sendPatchArticleById };
