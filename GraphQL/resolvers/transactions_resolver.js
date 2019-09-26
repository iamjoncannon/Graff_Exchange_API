let config = require('../../config');
const postgres_db = require("../../postgresDB_driver/postgres_driver")

// resolver receives a User_Profile upstream

module.exports = async (User_Profile) => {
    
    // call the transaction table with the id

    const transactions_call = "select * from transactions where userid = $1"

    let result 
    
    try {   
        
        result = await postgres_db.query(transactions_call, [User_Profile.id])
        
    } catch (error) {
        
        result = error
        console.log("error in holdings_resolver Query: ", error)
    }

    // convert dates to string- PG returns "Date" object

    result.rows.map(each=>{
        each.date_conducted = String(each.date_conducted)
        return each 
    })
    
    // return a holdings array for the downstream resolver

    return result.rows
}

