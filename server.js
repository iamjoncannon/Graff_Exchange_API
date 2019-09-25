const express = require('express');
const bodyParser = require('body-parser');
let validate_token = require('./route_handlers/validate_token');
let login = require('./route_handlers/login')
let signup  = require('./route_handlers/signup')
const { init_mongo_Pool } = require("./mongoDB_driver/pool")
let app = express(); 
const graphQLServer = require("./GraphQL/graphQLserver")
const port = process.env.PORT || 8000;

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

init_mongo_Pool(()=>{

    app.listen(port, () => console.log(`Server is listening on port: ${port}`));
})
