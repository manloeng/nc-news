const ENV = process.env.NODE_ENV || 'development';
const knex = require('knex');
const dbConfig = ENV === 'production' ? { client: 'pg', connection: process.env.DATABASE_URL } : require('../knexfile');

const connection = knex(dbConfig);

// const connection = {
//     host: process.DB_HOST,
//     port: process.env.DB_PORT || 5432,
//     user: process.env.DB_USER || 'postgres',
//     // password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME || 'postgres'
//   }

module.exports = connection;
