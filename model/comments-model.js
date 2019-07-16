const connection = require('../db/connection.js');

const postCommentByArticleId = ({ article_id }, { username, body, ...restOftheBody }) => {
	if (!username || !body) {
		return Promise.reject({
			status: 400,
			msg: 'Require Input'
		});
	}
	const formattedObj = {};
	formattedObj.article_id = article_id;
	formattedObj.author = username;
	formattedObj.body = body;
	return connection.insert(formattedObj).into('comments').returning('*').then((comment) => {
		return comment[0];
	});
};

module.exports = { postCommentByArticleId };
