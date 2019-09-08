const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'andrewchung',
  host: 'postgres',
  database: 'postgres',
//   password: 'secretpassword',
  port: 5432,
})

pool.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  pool.end()
})