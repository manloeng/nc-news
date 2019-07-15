exports.up = function(knex) {
	return knex.schema.createTable('comments', (commentsTable) => {
		commentsTable.increments('comment_id').primary();
		commentsTable.text('body');
		commentsTable.string('article_id').references('articles.article_id');
		commentsTable.string('author').references('users.username');
		commentsTable.integer('votes');
		commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('comments');
};
