const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
let validate_token = require('./route_handlers/validate_token');
let login = require('./route_handlers/login')
let signup  = require('./route_handlers/signup')
const { init_mongo_Pool } = require("./mongoDB_driver/pool")
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

app.post('/login', login);
app.post('/signup', signup);

app.get('/', 
    validate_token, 
    (req, res) => {
        res.json({
            success: true,
            message: req.decoded.id
        })
    }
);

// test connection to Postgres 
const test = postgres_pool.query("select now()", null, (err, res)=>{

    if(err){
        console.log("Connection to postgres failed: ", err)
        return
    }
    console.log("The time in Postgres is: ", res.rows[0].now)
})


// have to initialize server after mongo connection
init_mongo_Pool(()=>{

    app.listen(port, () => console.log(`Server is listening on port: ${port}`))
})
