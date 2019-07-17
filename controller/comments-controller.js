const {
	insertCommentByArticleId,
	getCommentByArticleId,
	patchCommentById,
	deleteCommentById
} = require('../model/comments-model.js');

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
			res.status(200).send({ comments });
		})
		.catch(next);
};

const sendPatchCommentById = (req, res, next) => {
	patchCommentById(req.params, req.body)
		.then((comment) => {
			res.status(200).send({ comment });
		})
		.catch(next);
};

const sendDeleteCommentById = (req, res, next) => {
	deleteCommentById(req.params)
		.then(() => {
			res.sendStatus(204);
		})
		.catch(next);
};

module.exports = { postCommentByArticleId, sendCommentByArticleId, sendPatchCommentById, sendDeleteCommentById };
