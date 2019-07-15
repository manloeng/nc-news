const topicsRouter = require('express').Router();
const { sendGetTopics } = require('../controller/topics-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

topicsRouter.route('/').get(sendGetTopics).all(sendMethodNotAllowed);

module.exports = topicsRouter;
