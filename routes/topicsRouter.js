const topicsRouter = require('express').Router();
const { sendTopics, postTopics } = require('../controller/topics-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

topicsRouter.route('/').get(sendTopics).post(postTopics).all(sendMethodNotAllowed);

module.exports = topicsRouter;
