// driver connection code to Postgres database
// exported and used in GraphQL resolvers

const { Pool } = require('pg')
const { PGUSER, PGPASSWORD } = process.env
const connectionString = `postgres://${PGUSER}:${PGPASSWORD}@localhost:5432/test`

const pool = new Pool({
  connectionString: connectionString,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
