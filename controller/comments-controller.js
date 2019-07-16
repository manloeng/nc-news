const { postCommentByArticleId } = require('../model/comments-model.js');

const sendPostCommentByArticleId = () => {
	console.log('sendPostCommentByArticleId');
	postCommentByArticleId();
};

module.exports = { sendPostCommentByArticleId };
