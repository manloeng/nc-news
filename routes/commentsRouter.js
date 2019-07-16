const commentsRouter = require('express').Router();
const { sendPatchCommentById, sendDeleteCommentById } = require('../controller/comments-controller.js');
const { sendMethodNotAllowed } = require('../errors/error.js');

commentsRouter
	.route('/:comment_id')
	.patch(sendPatchCommentById)
	.delete(sendDeleteCommentById)
	.all(sendMethodNotAllowed);

module.exports = commentsRouter;
