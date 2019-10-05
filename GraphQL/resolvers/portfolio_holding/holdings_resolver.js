const postgres_db = require("../../../postgresDB_driver/postgres_driver")
const { Redis } = require('../../../server')

// populates [ Holding ]

module.exports = async ( User_Profile ) => {

    // check the cache

    const redis_key = `${User_Profile.id}-holdings`

    let redis_data = await Redis.getAsync(redis_key)

    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )

        return JSON.parse(redis_data) 
    }

    
    // call the transaction table with the id

    const holdings_call = "select * from holdings where userid = $1 order by symbol"

    let result 
    
    try {   
        
        result = await postgres_db.query(holdings_call, [User_Profile.id])
        
    } catch (error) {
        
        result = error.statusText ? error.statusText : error ;

        console.log("error in quarterly financials resolver: ", result)
        
        return { "server_error": result } 
    }

    Redis.set(redis_key, JSON.stringify(result.rows) )

    // return a holdings array for the downstream resolver

    return result.rows 
}
