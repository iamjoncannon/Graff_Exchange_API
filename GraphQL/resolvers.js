const { connect_to_pool } = require("../mongoDB_driver/pool")
let config = require('../config');

const Query = {

    login: async ( _, {username, password} ) => {

        /*
        query get_users_query( $username: String ){
        
            login(username: $username)
        }
        */

        connect_to_pool( async (db) =>{

            let data_from_db = await db.db(config.db_name)
                                  .collection('user')
                                  .findOne( {username: username}) 
    
          
        })

        return String(username)
    },

    get_all_users: async ( _ ,__ , context ) => {

        console.log("here is context: ", Object.keys(context))

        connect_to_pool( async (db) =>{

            let data_from_db = await db.db(config.db_name)
                                  .collection('user')
                                  .find( {}).toArray()
    
            // console.log(data_from_db)
        })


        return "thing"
    }

    // get_data_points: async (root, { room_requested }) => {

    //     let room_ints = room_requested === "Grow Room" ? [4,5] : [6,7];

    //     const select_data_point_call = `select * from data_points where sensor_loc = $1 or sensor_loc = $2;`
        
    //     let result 

    //     try {   
        
    //         result = await db.query(select_data_point_call, room_ints)

    //     } catch (error) {
        
    //         result = error
    //         console.log("error in select_data_point_call Query: ", error)
    //     }
    
    //     return result.rows
    // }

}

const Mutation = {

    sign_up : async (root, { input } ) => {
        
        let data_from_db

        connect_to_pool( async (db) => {

            try {

                data_from_db = await db.db(config.db_name)
                                        .collection('user')
                                        .insertOne( input ) 
            }
            catch(err){
                
                if(err.errmsg.includes("duplicate username error")){

                        console.log("duplicate username error", err.errmsg)
                       
                }
                else{

                    console.log(err.errmsg)
                }
                
                return     

            }

            console.log(data_from_db.insertedId)
        }) 

        return data_from_db.insertedId
    }
}

// const Data_point = {

//     id: ({id}) => {return id},
//     time_stamp: ({time_stamp}) => {return String(time_stamp)},
//     val: ({val}) => {return val}
// }

// /*

// the sensor type and sensor location
// are separate objects in the data domain,

// you can imagine a whole host of other properties
// that could be retrieved, including a "list of readings"
// that would return [Datapoint] 

// */

// const sensor_type = {

//     id: (id) => {return id},
//     name: async (id)=>{

//         let result 

//         try{
//             result = await db.query("select sensor_type_name from sensor_types where id = $1", [Number(id)])
//         }
//         catch(err){
//             console.log('error in sensor_type select call: ', err.message)
//         }
      
//         return result.rows[0].sensor_type_name
//     }

// }

// const sensor_location = {

//     id: (id) => {return id},
//     name: async (id)=>{

//         let result 

//         try{

//             result = await db.query("select sensor_location_name from sensor_locations where id = $1", [Number(id)])
//         }
//         catch(err){
//             console.log('error in sensor_location select call: ', err.message)
//         }
      
//         return result.rows[0].sensor_location_name
//     }
// }

module.exports = { Query,
                   Mutation, 
                //    Data_point, 
                //    sensor_type, 
                //    sensor_location 
                 }


/*

"""

type Mutation {

    insert_data_point(input : data_point_input): Data_point
}

type Data_point {
    
    id: ID!
    sensor_type: sensor_type
    sensor_loc: sensor_location
    time_stamp: String!
    val: Float
}

type sensor_type {

    id: ID!
    name: String 
}

type sensor_location {

    id: ID!
    name: String 
}

input data_point_input {

    id: ID!
    sensor_type: Int
    sensor_loc: Int
    time_stamp: String!
    val: Float
}

"""

*/