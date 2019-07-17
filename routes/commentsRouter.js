const commentsRouter = require('express').Router();
const { patchCommentById, deleteCommentById } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

commentsRouter.route('/:comment_id').patch(patchCommentById).delete(deleteCommentById).all(sendMethodNotAllowed);

module.exports = commentsRouter;
