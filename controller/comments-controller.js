const { postCommentByArticleId, getCommentByArticleId } = require('../model/comments-model.js');

const sendPostCommentByArticleId = (req, res, next) => {
	postCommentByArticleId(req.params, req.body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

const sendGetCommentByArticleId = (req, res, next) => {
	console.log('sendGetCommentByArticleId');
	getCommentByArticleId();
};

module.exports = { sendPostCommentByArticleId, sendGetCommentByArticleId };
