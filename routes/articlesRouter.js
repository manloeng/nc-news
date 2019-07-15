const articlesRouter = require('express').Router();
const { sendGetArticlesById } = require('../controller/articles-controller.js');

articlesRouter.route('/:article_id').get(sendGetArticlesById);

module.exports = articlesRouter;
