const apiRouter = require('express').Router();
const topicsRouter = require('./topicsRouter.js');
const usersRouter = require('./usersRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js');
const sendJSON = require('../controller/api-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

apiRouter.route('/').get(sendJSON).all(sendMethodNotAllowed);

apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
