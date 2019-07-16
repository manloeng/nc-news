const connection = require('../db/connection.js');

const postCommentByArticleId = ({ article_id }, { username, body, ...restOfBodyData }) => {
	if (Object.keys(restOfBodyData).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}
	const formattedObj = {};
	formattedObj.article_id = article_id;
	formattedObj.author = username;
	formattedObj.body = body;
	return connection.insert(formattedObj).into('comments').returning('*').then((comment) => {
		if (comment[0].author === null) {
			return Promise.reject({
				status: 400,
				msg: 'Require Username Input'
			});
		} else return comment[0];
	});
};

const getCommentByArticleId = ({ article_id }, { order = 'desc', sort_by = 'created_at', ...restOfArticleData }) => {
	const objLength = Object.keys(restOfArticleData).length;

	if ((order === 'asc' && objLength === 0) || (order === 'desc' && objLength === 0)) {
		return connection
			.select('*')
			.from('comments')
			.orderBy(sort_by, order)
			.where('article_id', article_id)
			.then((comments) => {
				if (!comments.length) {
					return Promise.reject({
						status: 404,
						msg: 'Article ID Not Found'
					});
				}
				return comments;
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Invalid query'
		});
	}
};

const patchCommentById = ({ comment_id }, { inc_votes, ...restOfBodyData }) => {
	if (Object.keys(restOfBodyData).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}
	return connection
		.from('comments')
		.where('comment_id', comment_id)
		.increment('votes', inc_votes)
		.returning('*')
		.then((comment) => {
			if (!comment.length) {
				return Promise.reject({
					status: 404,
					msg: 'Comment ID Not Found'
				});
			}
			return comment[0];
		});
};

const deleteCommentById = () => {
	console.log('deleteCommentById');
};

module.exports = { postCommentByArticleId, getCommentByArticleId, patchCommentById, deleteCommentById };
