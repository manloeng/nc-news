const usersRouter = require('express').Router();
const { sendGetUserByUsername } = require('../controller/users-controller.js');

usersRouter.route('/:username').get(sendGetUserByUsername);

module.exports = usersRouter;
