const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'andrewchung',
  host: 'postgres',
  database: 'nc-news',
//   password: 'secretpassword',
  port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})