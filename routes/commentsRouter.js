const commentsRouter = require('express').Router();
const { sendPatchCommentById, sendDeleteCommentById } = require('../controller/comments-controller.js');

commentsRouter.route('/:comment_id').patch(sendPatchCommentById).delete(sendDeleteCommentById);

module.exports = commentsRouter;
