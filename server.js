const axios = require("axios")
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 10 });
// singleton axios object to prevent getting throttled by external APIs
module.exports.http = http 
// singleton Redis cache client
const Redis = require("./Redis/cache_root")
module.exports.Redis = Redis.client
// both have to be instantiated before GraphQL server
const express = require('express');
const bodyParser = require('body-parser');
const postgres_pool = require("./postgresDB_driver/postgres_driver")
const app = express(); 
const path = require("path")
const graphQLServer = require("./GraphQL/graphQLserver")
const port = process.env.PORT || 3000;
const public_asset_folder = '../Graff_Exchange/public'

graphQLServer.applyMiddleware({ app }); 

app.use(express.static(path.join(__dirname, public_asset_folder)))

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, public_asset_folder, "index.html"))
  }) 

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

