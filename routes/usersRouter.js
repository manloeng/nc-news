const usersRouter = require('express').Router();
const { sendUserByUsername, postUser, sendUser } = require('../controller/users-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

usersRouter.route('/').post(postUser).get(sendUser).all(sendMethodNotAllowed);

usersRouter.route('/:username').get(sendUserByUsername).all(sendMethodNotAllowed);

module.exports = usersRouter;
