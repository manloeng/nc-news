const { getArticlesById } = require('../model/articles-model.js');

const sendGetArticlesById = (req, res, next) => {
	getArticlesById(req.params)
		.then((articles) => {
			res.status(200).send({ articles });
		})
		.catch(next);
};

module.exports = { sendGetArticlesById };
