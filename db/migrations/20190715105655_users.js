exports.up = function(knex) {
	return knex.schema.createTable('users', (usersTable) => {
		usersTable.string('username').primary();
		usersTable.string('name', 40);
		usersTable.string('avatar_url');
		usersTable.string('password');
	});
};

exports.down = function(knex) {
	return knex.schema.dropTable('users');
};
