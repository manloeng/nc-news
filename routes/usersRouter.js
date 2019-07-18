const usersRouter = require('express').Router();
const { sendUserByUsername, postUser } = require('../controller/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

usersRouter.route('/').post(postUser).all(sendMethodNotAllowed);

usersRouter.route('/:username').get(sendUserByUsername).all(sendMethodNotAllowed);

module.exports = usersRouter;
