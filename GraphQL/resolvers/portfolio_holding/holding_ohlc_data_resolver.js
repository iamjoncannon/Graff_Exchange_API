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
        
        result = error.statusText ? error.statusText : error ;

        console.log("error in quarterly financials resolver: ", result)
        
        return { "server_error": result } 
    }

    Redis.set(redis_key, JSON.stringify(result.data) )
    
    // if during trading hours

    const is_EOD = (new Date()).getHours() < 17

    let expiry_time 

    if(is_EOD){

        // set key expiration to market open 
        const market_open = parseInt( (new Date().setHours(9, 30, 0, 0)) / 1000)
        expiry_time = market_open
    }
    else{

        // set to market close
        const market_close = parseInt( (new Date().setHours(16, 0, 0, 0)) / 1000)
        expiry_time = market_close 
    }
    
    Redis.expireat(redis_key, expiry_time);

    return result.data
}
