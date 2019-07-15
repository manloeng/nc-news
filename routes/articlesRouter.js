const articlesRouter = require('express').Router();
const { sendGetArticleById } = require('../controller/articles-controller.js');

articlesRouter.route('/:article_id').get(sendGetArticleById);

module.exports = articlesRouter;
