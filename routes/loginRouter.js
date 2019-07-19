const loginRouter = require('express').Router();
const { postLogin } = require('../controller/login-controller.js');

loginRouter.route('/').post(postLogin);

module.exports = loginRouter;
