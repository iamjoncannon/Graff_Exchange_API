const { http } = require('../../../server')
const { Redis } = require('../../../server')

// populates each stocks quarterly financial data from external
// news api

module.exports = async ( { symbol } ) => {
 
    // see note below 
    const redis_key = `${symbol}-financials`

    let redis_data = await Redis.getAsync(redis_key)
    
    if(redis_data !== null){
        
        console.log( "redis cache hit: ", redis_key )
                
        return { data : redis_data } 
    }
    

    
    let result 

    try {   

        let api_result = await http.get(`https://api.financialmodelingprep.com/api/v3/financials/income-statement/${symbol}?period=quarter`)
        
        result = api_result.data.financials.slice(0,4)

    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }


    // insert into the cache 

    let TTL = 60 * 60 * 24 * 7 
    
    Redis.set(redis_key, JSON.stringify( result ), "EX", TTL  )
        
    return { data : JSON.stringify( result ) }
}
