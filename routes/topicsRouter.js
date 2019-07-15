const topicsRouter = require('express').Router();
const { sendGetTopics } = require('../controller/topics-controller.js');

topicsRouter.route('/').get(sendGetTopics);

module.exports = topicsRouter;
