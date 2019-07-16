const commentsRouter = require('express').Router();
const { sendPatchCommentById } = require('../controller/comments-controller.js');

commentsRouter.route('/:comment_id').patch(sendPatchCommentById);

module.exports = commentsRouter;
