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
			console.log(article);
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
