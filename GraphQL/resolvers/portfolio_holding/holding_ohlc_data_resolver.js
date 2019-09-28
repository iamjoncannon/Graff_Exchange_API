const axios = require("axios")
const { http } = require('../../../server')

// populates each stocks financial data from external
// OHLC endpoint

module.exports = async ( Holding, args) => {

    // resolver may be called by parent node or 
    // by a query- 

    let symbol 

    if(Holding) symbol = Holding.symbol
    
    let result 
    
    try {   
        
        result = await http.get(`https://cloud.iexapis.com/beta/stock/${symbol}/quote/ohlc?token=${process.env.IEX_API_KEY}`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }
        
    return result.data
}
