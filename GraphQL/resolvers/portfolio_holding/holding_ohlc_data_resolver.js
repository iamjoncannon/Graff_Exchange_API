const { http } = require('../../../server')
const { Redis } = require('../../../server')

// populates each stocks financial data from external
// OHLC endpoint

module.exports = async ( Holding ) => {

    // resolver may be called by parent node or 
    // by a query- 

    let symbol 

    if(Holding) symbol = Holding.symbol

    
    const redis_key = `${symbol}-ohlc`

    let redis_data = await Redis.getAsync(redis_key)

    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )

        return JSON.parse(redis_data) 
    }




    let result 
    
    try {   
        
        result = await http.get(`https://cloud.iexapis.com/beta/stock/${symbol}/quote/ohlc?token=${process.env.IEX_API_KEY}`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }


    Redis.set(redis_key, JSON.stringify(result.data) )

    
    return result.data
}
