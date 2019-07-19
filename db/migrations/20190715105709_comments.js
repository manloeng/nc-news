exports.up = function(knex) {
	return knex.schema.createTable('comments', (commentsTable) => {
		commentsTable.increments('comment_id').primary();
		commentsTable.text('body').notNullable();
		commentsTable.integer('article_id').references('articles.article_id').onDelete('CASCADE');
		commentsTable.string('author').references('users.username').notNullable();
		commentsTable.integer('votes').defaultTo(0);
		commentsTable.timestamp('created_at').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('comments');
};
