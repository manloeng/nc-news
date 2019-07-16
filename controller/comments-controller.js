const { postCommentByArticleId, getCommentByArticleId, patchCommentById } = require('../model/comments-model.js');

const sendPostCommentByArticleId = (req, res, next) => {
	postCommentByArticleId(req.params, req.body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const sendGetCommentByArticleId = (req, res, next) => {
	getCommentByArticleId(req.params, req.query)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch(next);
};

const sendPatchCommentById = (req, res, next) => {
	console.log('sendPatchCommentById');
	patchCommentById();
};

module.exports = { sendPostCommentByArticleId, sendGetCommentByArticleId, sendPatchCommentById };
