const redis = require('redis')
const bluebird = require("bluebird")
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

class Redis{

    constructor(){

        this.client = redis.createClient()

        this.client._count_ = 0

        this.client.on("error", function (err) {
    
            console.log("Error " + err);
        });

        this.client.on("connect", ()=>{

             this.client.set("init_redis_cache", "Connected to Redis cache");
                
            this.client.getAsync("init_redis_cache").then(result => console.log(result))
        })
    }
}

module.exports = new Redis
