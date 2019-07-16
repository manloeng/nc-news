const connection = require('../db/connection.js');

const postCommentByArticleId = ({ article_id }, { username, body, ...restOftheBody }) => {
	if (Object.keys(restOftheBody).length > 0) {
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

const getCommentByArticleId = ({ article_id }, { order = 'desc', sort_by = 'created_at' }) => {
	return connection.select('*').from('comments').orderBy(sort_by, order).where('article_id', article_id);
};

module.exports = { postCommentByArticleId, getCommentByArticleId };
