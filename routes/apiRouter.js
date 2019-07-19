const apiRouter = require('express').Router();
const loginRouter = require('./loginRouter.js');
const topicsRouter = require('./topicsRouter.js');
const usersRouter = require('./usersRouter.js');
const articlesRouter = require('./articlesRouter.js');
const commentsRouter = require('./commentsRouter.js');
const sendGetJSON = require('../controller/api-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

apiRouter.route('/').get(sendGetJSON).all(sendMethodNotAllowed);

apiRouter.use('/login', loginRouter);
apiRouter.use('/topics', topicsRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/articles', articlesRouter);
apiRouter.use('/comments', commentsRouter);

module.exports = apiRouter;
