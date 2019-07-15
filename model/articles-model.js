const connection = require('../db/connection.js');

const getArticleById = ({ article_id }) => {
	return connection
		.first('articles.*')
		.count({ comment_count: 'comments.article_id' })
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
		.groupBy('articles.article_id')
		.where('articles.article_id', article_id)
		.then((article) => {
			if (!article) {
				return Promise.reject({
					status: 404,
					msg: 'Article Not Found'
				});
			}
			return article;
		});
};

const patchArticleById = ({ article_id }, { inc_votes }) => {
	return connection('articles')
		.where('article_id', article_id)
		.increment('votes', inc_votes)
		.returning('*')
		.then((article) => {
			if (!article.length) {
				return Promise.reject({
					status: 404,
					msg: 'Article ID Not Found'
				});
			}
			return article[0];
		});
};

module.exports = { getArticleById, patchArticleById };
