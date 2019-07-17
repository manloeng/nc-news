const connection = require('../db/connection.js');
const checkIfExists = require('../errors/checkExist.js');

const insertCommentByArticleId = ({ article_id }, { username, body, ...restOfReqBody }) => {
	const reg = /([A-Z])\w+/i;
	if (
		// Checks for extra invalid queries
		Object.keys(restOfReqBody).length > 0 ||
		// Checks for invalid username format (i.e Int)
		!reg.test(username)
	) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

	// const queryExist = checkIfExists(article_id, 'articles', 'article_id').then((article) => {
	// 	// Checks if article ID exists in the database
	// 	if (!article.length) {
	// 		return Promise.reject({
	// 			status: 404,
	// 			msg: "Article ID Doesn't Exist"
	// 		});
	// 	}
	// });
	const formattedObj = { article_id, body, author: username };
	return connection.insert(formattedObj).into('comments').returning('*').then((comment) => {
		return comment[0];
	});
};

const getCommentByArticleId = ({ article_id }, { order = 'desc', sort_by = 'created_at', ...restOfReqBody }) => {
	const objLength = Object.keys(restOfReqBody).length;

	if (
		// Checks if the Order Query is 'asc' or 'desc'
		!(
			(order === 'asc' || order === 'desc') &&
			// And Checks if the passed query keys - length
			objLength === 0
		)
	) {
		return Promise.reject({
			status: 400,
			msg: 'Require a Valid Query'
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
			msg: 'Require a Valid Query'
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
