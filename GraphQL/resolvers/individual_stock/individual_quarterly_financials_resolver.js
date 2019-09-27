const axios = require("axios")
const http = require('../../../server')

// populates each stocks quarterly financial data from external
// news api

module.exports = async ( { symbol } ) => {
    
    let result 

    try {   

        result = await http.get(`https://api.financialmodelingprep.com/api/v3/financials/income-statement/${symbol}?period=quarter`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }
        
    return { data : JSON.stringify(result.data.financials) }
}
