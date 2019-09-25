const holdings_resolver = require('./holdings_resolver')

const transaction_resolver = () => {

    
}

module.exports = {

    first_name: ({first_name}) => { return first_name},
    last_name: ({last_name}) => { return last_name},
    email: ({email}) => { return email},
    token: ({token}) => { return token},
    balance: ({balance}) => { return balance},
    holdings: holdings_resolver
}