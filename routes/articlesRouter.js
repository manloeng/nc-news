const articlesRouter = require('express').Router();
const { sendGetArticleById, sendPatchArticleById } = require('../controller/articles-controller.js');
const { sendPostCommentByArticleId } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

articlesRouter.route('/:article_id').get(sendGetArticleById).patch(sendPatchArticleById).all(sendMethodNotAllowed);
articlesRouter.route('/:article_id/comments').post(sendPostCommentByArticleId);

module.exports = articlesRouter;
