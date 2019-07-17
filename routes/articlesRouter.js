const articlesRouter = require('express').Router();
const { sendArticleById, sendPatchArticleById, sendArticles } = require('../controller/articles-controller.js');
const { sendPostCommentByArticleId, sendGetCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

articlesRouter.route('/').get(sendArticles).all(sendMethodNotAllowed);
articlesRouter.route('/:article_id').get(sendArticleById).patch(sendPatchArticleById).all(sendMethodNotAllowed);
articlesRouter
	.route('/:article_id/comments')
	.post(sendPostCommentByArticleId)
	.get(sendGetCommentByArticleId)
	.all(sendMethodNotAllowed);

module.exports = articlesRouter;
