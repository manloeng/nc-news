const {
	insertCommentByArticleId,
	getCommentByArticleId,
	updateCommentById,
	destroyCommentById
} = require('../model/comments-model.js');

const { totalCommentCountByArticleID } = require('../model/articles-model.js');

const postCommentByArticleId = (req, res, next) => {
	insertCommentByArticleId(req.params, req.body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const sendCommentByArticleId = (req, res, next) => {
	getCommentByArticleId(req.params, req.query)
		.then((comments) => {
			const total_count = totalCommentCountByArticleID(req.params);
			return Promise.all([ total_count, comments ]);
		})
		.then(([ total_count, comments ]) => {
			res.status(200).send({ total_count, comments });
		})
		.catch(next);
};

const patchCommentById = (req, res, next) => {
	updateCommentById(req.params, req.body)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

const deleteCommentById = (req, res, next) => {
	destroyCommentById(req.params)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports = {
	postCommentByArticleId,
	sendCommentByArticleId,
	patchCommentById,
	deleteCommentById
};
