// define all resolvers for API

const login_resolver = require("./resolvers/authentication/login")
const sign_up_resolver = require("./resolvers/authentication/signup")

const make_trade_mutation_resolver = require('./resolvers/make_trade_mutation')

const holdings_resolver = require('./resolvers/portfolio_holding/holdings_resolver')
const transaction_resolver = require("./resolvers/transactions_resolver")
const ohlc_data_resolver = require('./resolvers/portfolio_holding/holding_ohlc_data_resolver')

const news_data_resolver = require('./resolvers/individual_stock/individual_stock_news_resolver')
const quarterly_financials_resolver = require('./resolvers/individual_stock/individual_quarterly_financials_resolver')
const time_series_financials_resolver = require('./resolvers/individual_stock/individual_time_series_data_resolver')

const Query = {

    login: login_resolver,
    hydrate_portfolio: ( _, __, req ) => { return  {id: req.body.token.id} },
    all_individual_stock_data: ( _, symbol ) => { return symbol },
    hydrate_news: (_, vars) => { return news_data_resolver(vars) },
    hydrate_quarterly_financials: (_, vars) => { return quarterly_financials_resolver(vars) },
    hydrate_time_series_data: (_, vars) => { return time_series_financials_resolver(vars) },
}

const Mutation = {

    sign_up : sign_up_resolver,
    make_trade_mutation: make_trade_mutation_resolver
}

const User_Profile = {

    holdings: holdings_resolver, // [ Holding ]
    transaction_history: transaction_resolver // [ Transaction ]
}

const Portfolio = {

    holdings: holdings_resolver, // [ Holding ]
    transaction_history: transaction_resolver // [ Transaction ]
}

const Holding = {
    
    // see note below
    user_data: ( user_data ) => { return user_data }, 
    ohlc_data: ohlc_data_resolver   
}

const Individual_Stock_Data = {
    news: news_data_resolver,
    quarterly_financials: quarterly_financials_resolver,
    time_series: time_series_financials_resolver
}

const Trade_Return_Data = {

    transaction_result: ( transaction_result ) => { return transaction_result },
    ohlc_data: ohlc_data_resolver
}

module.exports = { Query,
                   Mutation, 
                   User_Profile,
                   Portfolio,
                   Holding,
                   Individual_Stock_Data,
                   Trade_Return_Data,
                 }

/*

Note- 

The main goal of porting this API to GraphQL is to split data servicing
between the mobile and web versions of the application- 

In several of the operations above, we want to give the client
the option to populate one basic operation with other data

For example, login resolves with a type User_Profile, which itself
contains [ Holding ] and [ transaction_history ], which have
separate resolvers 

Optionally, we want the client to be able to request OHLC data
on each of [ Holding ]

However, if "user_data"- the user specifc properties for each Holding- 
are not defined as a separate object, but rather directly as properties 
of each Holding returned from the parent resolver, and the OHLC data is  
then defined as a property of Holding, GraphQL will not treat resolving 
them as separate operations (they're "the same node" so to speak, they 
don't have separate edges from a shared parent node)

It will expect the parent resolver that issues [ Holding ] - defined
on the User Profile resolver - to populate the OHLC data, which would
not give the client the option to exclude that data. 

In order to have GraphQL manage these as two separate operations,
the solution I found was to define the data returned from the parent
resolver as a separate object, then superficially populate this in a 
separate function, alongside the additional data that I want the client
to be able to optionally request. 

This looks like:

    Returned from parent resolver:
    user_data: ( user_data ) => { return user_data }, 

    Optionally popualted in mobile version of app: 
    ohlc_data: ohlc_data_resolver 

*/