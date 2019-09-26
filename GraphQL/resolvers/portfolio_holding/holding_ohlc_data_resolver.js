const axios = require("axios")
const http = require('../../../server')

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

/*

Values used in client:

Entire Object returned looks like:

symbol: 'PI',
companyName: 'Impinj, Inc.',
primaryExchange: 'NASDAQ',
calculationPrice: 'tops',
open: null,
openTime: null,
close: null,
closeTime: null,
high: null,
low: null,
latestPrice: 31.92,
latestSource: 'IEX price',
latestTime: '3:59:57 PM',
latestUpdate: 1569441597210,
latestVolume: null,
iexRealtimePrice: 31.92,
iexRealtimeSize: 100,
iexLastUpdated: 1569441597210,
delayedPrice: null,
delayedPriceTime: null,
extendedPrice: null,
extendedChange: null,
extendedChangePercent: null,
extendedPriceTime: null,
previousClose: 31.18,
previousVolume: 322542,
change: 0.74,
changePercent: 0.02373,
volume: null,
iexMarketPercent: 0.009728099615740065,
iexVolume: 1600,
avgTotalVolume: 290613,
iexBidPrice: 0,
iexBidSize: 0,
iexAskPrice: 0,
iexAskSize: 0,
marketCap: 705910800,
peRatio: -28.29,
week52High: 40.24,
week52Low: 13.25,
ytdChange: 1.116347,
lastTradeTime: 1569441600750,
isUSMarketOpen: false

*/
