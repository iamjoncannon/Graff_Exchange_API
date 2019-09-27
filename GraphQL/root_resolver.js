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
    hydrate_news: (_, vars) => { return news_data_resolver(vars)},
    hydrate_quarterly_financials: (_, vars) => { return quarterly_financials_resolver(vars)},
    hydrate_time_series_data: (_, vars) => { return time_series_financials_resolver(vars)},
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

note- 

the main goal of porting this API to GraphQL is to split data servicing
between the mobile and web versions of the application- 

in several of the operations above, we want to give the client
the option to populate one basic operation with other data

for example, login resolves with a type User_Profile, which itself
contains [ Holding ] and [ transaction_history ], which have
separate resolvers 

optionally, we want the client to be able to request OHLC data
on each of these holdings

however, if the user properties for each Holding- the users's 
specific holding of that stock- are not defined as a separate
object, but rather directly as properties of each Holding 
returned from the parent resolver, and further, the OHLC data is itself 
then defined as a property of Holding, GraphQL will 
not treat resolving them as separate operations (they're "the  
same node" so to speak, they don't have separate edges from the 
parent resolver node)

it will expect the parent resolver that issues [ Holding ] - defined
on the User Profile resolver, to populate the OHLC data, which would
mean iterateing over the array in the parent 
resolver and making the OHLC database call- 
defeating the purpose of using GraphQL

in order to have GraphQL manage these as two separate operations,
the solution I found was to define the data returned from the parent
resolver as a separate object, then superficially populate this as a
separate property alongside the additional data that I want the client
to be able to request. 

*/