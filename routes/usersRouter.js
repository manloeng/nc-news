const usersRouter = require('express').Router();
const { sendGetUserByUsername } = require('../controller/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

usersRouter.route('/:username').get(sendGetUserByUsername).all(sendMethodNotAllowed);

module.exports = usersRouter;
