exports.up = function(knex) {
	return knex.schema.createTable('articles', (articlesTable) => {
		articlesTable.increments('article_id').primary();
		articlesTable.string('title').notNullable();
		articlesTable.integer('topic').references('topics.slug');
		articlesTable.string('author').references('users.username');
		articlesTable.text('body');
		articlesTable.timestamp('created_at').defaultTo(knex.fn.now());
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('articles');
};
