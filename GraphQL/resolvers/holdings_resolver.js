let config = require('../../config');
const postgres_db = require("../../postgresDB_driver/postgres_driver")

// resolver receives a User_Profile upstream

module.exports = async (User_Profile) => {
    
    // call the transaction table with the id

    const holdings_call = "select * from holdings where userid = $1"

    let result 
    
    try {   
        
        result = await postgres_db.query(holdings_call, [User_Profile.id])
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error)
    }
    
    // return a holdings array for the downstream resolver

    return return_array
}
