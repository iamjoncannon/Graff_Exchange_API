const { http } = require('../../../server')
const { Redis } = require('../../../server')

// populates each stocks time series data from external
// news api

module.exports = async ( { symbol } ) => {

    // check the cache

    const redis_key = `${symbol}-time-series`

    let redis_data = await Redis.getAsync(redis_key)

    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )

        return JSON.parse(redis_data)
    }

    let result 

    try {   

        result = await http.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=365`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }

    // insert into the cache 

    Redis.set(redis_key, JSON.stringify(result.data.historical) )
    
    // data expires at EOD

    expiry_time = parseInt( (new Date().setHours(9, 30, 0, 0)) / 1000)
    
    Redis.expireat(redis_key, expiry_time);

    return result.data.historical
}
