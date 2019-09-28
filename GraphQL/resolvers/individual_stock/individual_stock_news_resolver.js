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

        result = await http.get(`https://stocknewsapi.com/api/v1?tickers=${symbol}&items=30&token=${process.env.NEWS_API_KEY}`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }


    
    Redis.set(redis_key, JSON.stringify(result.data.data) )

    
    return result.data.data
}
