const { postCommentByArticleId } = require('../model/comments-model.js');

const sendPostCommentByArticleId = (req, res, next) => {
	postCommentByArticleId(req.params, req.body)
		.then((comment) => {
			res.status(201).send({ comment });
		})
		.catch(next);
};

module.exports = { sendPostCommentByArticleId };
