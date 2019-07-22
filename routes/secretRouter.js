const secretRouter = require('express').Router();
const { sendSecrets } = require('../controller/secrets-controller.js');

secretRouter.route('/').get(sendSecrets);

module.exports = secretRouter;
