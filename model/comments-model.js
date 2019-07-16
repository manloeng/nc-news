const connection = require('../db/connection.js');

const postCommentByArticleId = ({ article_id }, { username, body, ...restOftheBody }) => {
	const formattedObj = {};
	formattedObj.article_id = article_id;
	formattedObj.author = username;
	formattedObj.body = body;
	return connection.insert(formattedObj).into('comments').returning('*').then((comment) => {
		return comment[0];
	});
};

module.exports = { postCommentByArticleId };
