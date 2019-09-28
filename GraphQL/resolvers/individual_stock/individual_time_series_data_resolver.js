const { http } = require('../../../server')

// populates each stocks time series data from external
// news api

module.exports = async ( { symbol } ) => {
    
    let result 

    try {   

        result = await http.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?timeseries=365`)
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error.statusText)
    }
        
    return result.data.historical
}
