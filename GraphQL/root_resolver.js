const login_resolver = require("./resolvers/authentication/login")
const sign_up_resolver = require("./resolvers/authentication/signup")
const holdings_resolver = require('./resolvers/portfolio_holding/holdings_resolver')
const transaction_resolver = require("./resolvers/transactions_resolver")
const ohlc_data_resolver = require('./resolvers/portfolio_holding/holding_ohlc_data_resolver')
const news_data_resolver = require('./resolvers/individual_stock/individual_stock_news_resolver')
const quarterly_financials_resolver = require('./resolvers/individual_stock/individual_querterly_financials_resolver')

const Query = {

    login: login_resolver,
    all_individual_stock_data: ( _, symbol ) => { return symbol }
    // hydrate_portfolio: hydrate_portfolio_resolver
}

const Mutation = {

    sign_up : sign_up_resolver
}

const User_Profile = {

    holdings: holdings_resolver, // [ Holding ]
    transaction_history: transaction_resolver // [ Transaction ]
}

// see note below

const Holding = {
    // note- user data only populated from login call
    user_data: ( user_data ) => { return user_data },
    ohlc_data: ohlc_data_resolver   
}

const Individual_Stock_Data = {
    news: news_data_resolver,
    quarterly_financials: quarterly_financials_resolver
}

const News_Story = news_data_resolver

const Quarterly_Financials = quarterly_financials_resolver

module.exports = { Query,
                   Mutation, 
                   User_Profile,
                   Holding,
                   Individual_Stock_Data,
                   News_Story,
                   Quarterly_Financials
                 }

/*

note- 

the properties in the user_data_resolver, in the client,
are parallel with the properties returned from the financial_data 
(which is just "data"- admittedly not the best variable name )
 
the client is currently organized that way, but to port the API
to GraphQL, we need to bundle the user fields into a separate 
object. 

my strategic intention was to split the way data is serviced
between the mobile and web versions of the application- the mobile
version will request the entirety of the object and the web will
make subsquent calls in a separate query- 

if the user data is resolved by a function directly in the holding object,
the user fields will be automatically
resolved from the database call, meaning, in order to hydrate
the "data" object from the API call, we would have to iterate
over the holdings array inside the postgres database call
and manually call the external api, 
like we did in the Redux thunk in the first version of the application- 
this would defeat the purpose of using GraphQL

(in graph jargon, basically, these
would not have two separate edges from their parent node, the
financial data would in some sense be in the same node 
as the user data, and wouldn't be managed by the GraphQL
engine. the object nesting is what creates the edges)

the solution is to split them, superficially populate
the user fields, then have the client 
reformat the data in the thunk so that it has the structure
expected by the React components 

*/