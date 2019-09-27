const postgres_db = require("../../../postgresDB_driver/postgres_driver")

// populates entire holdings from database

module.exports = async ( User_Profile, y, z ) => {
    
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

    return result.rows 
}


