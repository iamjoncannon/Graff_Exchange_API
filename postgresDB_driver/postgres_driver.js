// driver connection code to Postgres database
// exported and used in GraphQL resolvers

const { Pool } = require('pg')
const { postgres_url } = require('../config')

const pool = new Pool({
  connectionString: postgres_url,
})

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  },
}
