const MongoClient = require('mongodb').MongoClient;  

var mongo_databse_connection;

const option = {
    useNewUrlParser: true,
    poolSize : 40,
    useUnifiedTopology: true
};

function init_mongo_Pool(callback){

  MongoClient.connect(require("../config").mongo_url, option, function(err, db) {
   
    if (err) {
        console.log("error connecting to Mongo database: ", err);
        process.exit(1)
    }

    mongo_databse_connection = db;

    console.log("connected to: ", db.s.url)

    callback()
  })
}

function connect_to_pool(callback){

    callback(mongo_databse_connection)
}

module.exports = {
    init_mongo_Pool,
    connect_to_pool
};
