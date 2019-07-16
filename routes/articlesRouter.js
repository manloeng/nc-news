const articlesRouter = require('express').Router();
const { sendGetArticleById, sendPatchArticleById, sendGetArticles } = require('../controller/articles-controller.js');
const { sendPostCommentByArticleId, sendGetCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

articlesRouter.route('/').get(sendGetArticles);
articlesRouter.route('/:article_id').get(sendGetArticleById).patch(sendPatchArticleById).all(sendMethodNotAllowed);
articlesRouter
	.route('/:article_id/comments')
	.post(sendPostCommentByArticleId)
	.get(sendGetCommentByArticleId)
	.all(sendMethodNotAllowed);

module.exports = articlesRouter;
