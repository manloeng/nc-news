const connection = require('../db/connection.js');

const getArticleById = ({ article_id }) => {
	return connection.first('*').from('articles').where('article_id', article_id);
};

module.exports = { getArticleById };
