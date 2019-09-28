const axios = require("axios")
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 10 });
// singleton axios object to prevent getting throttled by external APIs
// has to be instantiated before GraphQL server
module.exports.http = http 
const Redis = require("./Redis/cache_root")
module.exports.Redis = Redis.client

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const postgres_pool = require("./postgresDB_driver/postgres_driver")
let app = express(); 
const graphQLServer = require("./GraphQL/graphQLserver")
const port = process.env.PORT || 8000;

app.use(cors())
app.options('*', cors())

graphQLServer.applyMiddleware({ app }); 

app.use(bodyParser.urlencoded({ 
    extended: true
}));

app.use(bodyParser.json());

// test connection to Postgres 
const test = postgres_pool.query("select now();", null, (err, res)=>{

    if(err){
        console.log("Connection to postgres failed: ", err)
        return
    }
    console.log("The time in postgres is ", res.rows[0].now)
})

app.listen(port, () => console.log(`Server is listening on port: ${port}`))

