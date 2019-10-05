const { http } = require('../../../server')
const { Redis } = require('../../../server')

// populates each stocks news data from external
// news api

module.exports = async ( { symbol } ) => {

    const redis_key = `${symbol}-news`

    let redis_data = await Redis.getAsync(redis_key)

    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )

        return JSON.parse(redis_data) 
    }

    let result 

    try {   
        console.log("calling api")
        result = await http.get(`https://stocknewsapi.com/api/v1?tickers=${symbol}&items=30&token=${process.env.NEWS_API_KEY}`)
        
    } catch (error) {
        
        result = error.statusText ? error.statusText : error ;

        console.log("error in quarterly financials resolver: ", result)
        
        return { "server_error": result } 
    }

    // news keys expire in 24 hours - 60s * 60m * 24h
    let TTL = 60 * 60 * 24
    
    Redis.set(redis_key, JSON.stringify(result.data.data), "EX", TTL )
 
    return result.data.data
}
