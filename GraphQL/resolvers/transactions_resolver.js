const postgres_db = require("../../postgresDB_driver/postgres_driver")
const { Redis } = require('../../server')
// populates [ Transaction ]
// resolver receives a User_Profile upstream

module.exports = async (User_Profile) => {

    // check the cache

    const redis_key = `${User_Profile.id}-transactions`

    let redis_data = await Redis.getAsync(redis_key)
    
    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )

        return JSON.parse(redis_data)
    }
    
    // call the transaction table with the id

    const transactions_call = "select * from transactions where userid = $1"

    let result 
    
    try {   
        
        result = await postgres_db.query(transactions_call, [User_Profile.id])
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error)
    }

    // convert dates to string- PG returns "Date" object

    result.rows.map(each=>{
        each.date_conducted = String(each.date_conducted)
        return each 
    })

    // insert into the cache 
    
    Redis.set(redis_key, JSON.stringify(result.rows))

    // return a holdings array for the downstream resolver

    return result.rows
}

