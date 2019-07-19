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

const updateArticleById = ({ article_id }, { inc_votes = 0, ...restOfReqBody }) => {
	// Checks the passed query keys - length
	if (Object.keys(restOfReqBody).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Require a Valid Query'
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

const getArticles = ({
	order = 'desc',
	sort_by = 'created_at',
	author,
	topic,
	limit = 10,
	p = 1,
	...restOfReqBody
}) => {
	const objLength = Object.keys(restOfReqBody).length;
	const reg = /([A-Z])\w+/i;

	if (
		// Checks if author or topic has a valid format
		!reg.test(author) ||
		!reg.test(topic) ||
		// Checks if the Order Query is 'asc' or 'desc'
		!(
			(order === 'asc' || order === 'desc') &&
			// And Checks the passed query keys - length
			objLength === 0
		)
	) {
		return Promise.reject({
			status: 400,
			msg: 'Require a Valid Query'
		});
	}

	const offsetLimit = p * limit - limit;

	return connection
		.select('articles.article_id', 'articles.author', 'articles.created_at', 'articles.votes', 'title', 'topic')
		.from('articles')
		.leftJoin('comments', 'articles.article_id', 'comments.article_id')
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
			queryBuilder.limit(limit).offset(offsetLimit);
		})
		.then((articles) => {
			if (!articles.length) {
				return Promise.reject({
					status: 404,
					msg: 'Data Not Found'
				});
			}
			return articles;
		});
};

const insertArticles = ({ username, title, topic, body, ...restOfReqBody }) => {
	if (Object.keys(restOfReqBody).length > 0) {
		return Promise.reject({
			status: 400,
			msg: 'Require a Valid Query'
		});
	}

	const formattedObj = { author: username, topic, title, body };
	return connection.insert(formattedObj).into('articles').returning('*').then((article) => article[0]);
};

const destroyArticleById = ({ article_id }) => {
	return connection.from('articles').where('article_id', article_id).del().then((deleteCount) => {
		if (!deleteCount) {
			return Promise.reject({
				status: 404,
				msg: 'Article ID Not Found'
			});
		}
	});
};

const totalArticleCount = () => {
	return connection.select().count('article_id').from('articles').then(([ { count } ]) => {
		return +count;
	});
};

const totalCommentCountByArticleID = ({ article_id }) => {
	return connection
		.select()
		.count('comment_id')
		.from('comments')
		.where('article_id', article_id)
		.then(([ { count } ]) => {
			return +count;
		});
};

module.exports = {
	getArticleById,
	updateArticleById,
	getArticles,
	insertArticles,
	destroyArticleById,
	totalArticleCount,
	totalCommentCountByArticleID
};
