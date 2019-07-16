const connection = require('../db/connection.js');

const postCommentByArticleId = ({ article_id }, { ...body }) => {
	body.article_id = article_id;
	return connection.insert(body).into('comments').returning('*').then((comment) => comment[0]);
};

module.exports = { postCommentByArticleId };
