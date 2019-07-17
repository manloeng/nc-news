const usersRouter = require('express').Router();
const { sendUserByUsername } = require('../controller/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

usersRouter.route('/:username').get(sendUserByUsername).all(sendMethodNotAllowed);

module.exports = usersRouter;
