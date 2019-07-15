const { topicData, articleData, commentData, userData } = require('../data/index.js');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = function(knex) {
	const topicsInsertions = knex('topics').insert(topicData).returning('*');
	const usersInsertions = knex('users').insert(userData).returning('*');

	return knex.migrate
		.rollback()
		.then(() => {
			return knex.migrate.latest();
		})
		.then(() => {
			return Promise.all([ topicsInsertions, usersInsertions ]);
		})
		.then(() => {
			const formmatedArticles = formatDates(articleData);
			return knex.insert(formmatedArticles).into('articles').returning('*');
		})
		.then((articleRows) => {
			console.log(articleRows);
			/*

	  Your comment data is currently in the incorrect format and will violate your SQL schema.

	  Keys need renaming, values need changing, and most annoyingly, your comments currently only refer to the title of the article they belong to, not the id.

	  You will need to write and test the provided makeRefObj and formatComments utility functions to be able insert your comment data.
	  */

			const articleRef = makeRefObj(articleRows);
			const formattedComments = formatComments(commentData, articleRef);
			return knex('comments').insert(formattedComments);
		});
};
