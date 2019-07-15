const connection = require('../db/connection.js');

const getArticleById = ({ article_id }) => {
	return connection.first('*').from('articles').where('article_id', article_id).then((article) => {
		if (!article) {
			return Promise.reject({
				status: 404,
				msg: 'Article Not Found'
			});
		}
		return article;
	});
};

module.exports = { getArticleById };
