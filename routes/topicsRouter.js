const topicsRouter = require('express').Router();
const { sendTopics } = require('../controller/topics-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

topicsRouter.route('/').get(sendTopics).all(sendMethodNotAllowed);

module.exports = topicsRouter;
