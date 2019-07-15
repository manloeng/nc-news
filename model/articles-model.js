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
					msg: 'Article ID Not Found'
				});
			}
			return article;
		});
};

const patchArticleById = ({ article_id }, { inc_votes, ...restOfReqBody }) => {
	if (Object.keys(restOfReqBody).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Not a Valid Key-Value'
		});
	}
	return connection
		.from('articles')
		.where('article_id', article_id)
		.increment('votes', inc_votes)
		.returning('*')
		.then(() => {
			return getArticleById({ article_id });
		})
		.then((article) => {
			return article;
		});
};

module.exports = { getArticleById, patchArticleById };
