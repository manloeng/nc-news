const articlesRouter = require('express').Router();
const {
	sendArticleById,
	patchArticleById,
	sendArticles,
	postArticles
} = require('../controller/articles-controller.js');
const { postCommentByArticleId, sendCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

articlesRouter.route('/').get(sendArticles).post(postArticles).all(sendMethodNotAllowed);
articlesRouter.route('/:article_id').get(sendArticleById).patch(patchArticleById).all(sendMethodNotAllowed);
articlesRouter
	.route('/:article_id/comments')
	.post(postCommentByArticleId)
	.get(sendCommentByArticleId)
	.all(sendMethodNotAllowed);

module.exports = articlesRouter;
