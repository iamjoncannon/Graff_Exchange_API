const postgres_db = require("../../postgresDB_driver/postgres_driver")

const login = async ( _, args )  => {

    const login_query = "select * from users where email = $1"

    let result 

    try {   
    
        result = await postgres_db.query(select_data_point_call, room_ints)

    } catch (error) {
    
        result = error
        console.log("error in select_data_point_call Query: ", error)
    }

    return 
}

module.exports = login
