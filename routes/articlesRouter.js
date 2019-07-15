const articlesRouter = require('express').Router();
const { sendGetArticleById, sendPatchArticleById } = require('../controller/articles-controller.js');

articlesRouter.route('/:article_id').get(sendGetArticleById).patch(sendPatchArticleById);

module.exports = articlesRouter;
