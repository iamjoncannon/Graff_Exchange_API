const axios = require("axios")
const http = require('../../../server')

// populates each stocks news data from external
// news api

module.exports = async ( { symbol } ) => {
    
    let result 

    try {   

        result = await http.get(`https://stocknewsapi.com/api/v1?tickers=${symbol}&items=30&token=${process.env.NEWS_API_KEY}`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }
    
    return result.data.data
    
}
