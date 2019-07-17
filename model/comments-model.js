const connection = require('../db/connection.js');

const insertCommentByArticleId = ({ article_id }, { username, body, ...restOfReqBody }) => {
	if (Object.keys(restOfReqBody).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

	const formattedObj = { article_id, body, author: username };
	return connection.insert(formattedObj).into('comments').returning('*').then((comment) => {
		return comment[0];
	});
};

const getCommentByArticleId = ({ article_id }, { order = 'desc', sort_by = 'created_at', ...restOfReqBody }) => {
	const objLength = Object.keys(restOfReqBody).length;

	if (!((order === 'asc' && objLength === 0) || (order === 'desc' && objLength === 0))) {
		return Promise.reject({
			status: 400,
			msg: 'Invalid query'
		});
	}

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
};

const updateCommentById = ({ comment_id }, { inc_votes, ...restOfReqBody }) => {
	if (Object.keys(restOfReqBody).length > 0) {
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

const destroyCommentById = ({ comment_id }) => {
	return connection.from('comments').where('comment_id', comment_id).del().then((deleteCount) => {
		if (!deleteCount) {
			return Promise.reject({
				status: 404,
				msg: 'Comment ID Not Found'
			});
		}

		return deleteCount;
	});
};

module.exports = { insertCommentByArticleId, getCommentByArticleId, updateCommentById, destroyCommentById };
