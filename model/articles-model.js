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

const updateArticleById = ({ article_id }, { inc_votes, ...restOfReqBody }) => {
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

const getArticles = ({ order = 'desc', sort_by = 'created_at', author, topic, ...restOfReqBody }) => {
	const objLength = Object.keys(restOfReqBody).length;
	const reg = /([A-Z])\w+/i;

	if (!reg.test(author) || !reg.test(topic)) {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}

	if ((order === 'asc' && objLength === 0) || (order === 'desc' && objLength === 0)) {
		return connection
			.select('articles.article_id', 'articles.author', 'articles.created_at', 'articles.votes', 'title', 'topic')
			.from('articles')
			.leftJoin('comments', 'articles.article_id', 'comments.comment_id')
			.count({ comment_count: 'comments.article_id' })
			.groupBy('articles.article_id')
			.orderBy(sort_by, order)
			.modify((queryBuilder) => {
				if (author) {
					queryBuilder.where('articles.author', author);
				}
				if (topic) {
					queryBuilder.where('topic', topic);
				}
			});
	} else {
		return Promise.reject({
			status: 400,
			msg: 'Bad Request'
		});
	}
};

module.exports = { getArticleById, updateArticleById, getArticles };
