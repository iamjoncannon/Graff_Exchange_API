const postgres_db = require("../../postgresDB_driver/postgres_driver")
const bcrypt = require('bcrypt')
const { UserInputError } = require('apollo-server-express');
let jwt = require('jsonwebtoken');
let config = require('../../config');

const login = async ( _, { email, password } )  => {

    // make database call to obtain row for user

    const login_query = "select * from users where email = $1"
    
    let result 
    
    try {   
        
        result = await postgres_db.query(login_query, [email])
        
    } catch (error) {
        
        result = error
        console.log("error in login Query: ", error)
    }

    if( !result.rows || !result.rows[0]){
        
        throw new UserInputError('Server Error- unable to find user', result);
    }

    const hashed_password = result.rows[0].password
    
    // compare to input password
    
    let passwords_match 

    try {

        passwords_match = await bcrypt.compare( password, hashed_password );
    }
    catch(error){

        console.log(error)
    }
    
    // return error if they don't match
    
    if( !passwords_match ){

        throw new UserInputError('Invalid password', result);
    }

    // otherwise, generate a token and return the full user object
    
    const { id } = result.rows[0]

    let token = jwt.sign( { id }, config.secret, { expiresIn: '24h'} );
                        
                        // this includes the hashed
                        // password- but this won't 
                        // get returned to the client
                        // by the resolver 
    const returned_user = { ... result.rows[0], token } 
                        
    return returned_user
}

module.exports = login

/*

query login_call($email: String, $password: String) {

	login(email: $email, password: $password){
    first_name
  }
}

{
  "email": "String",
  "password":"String"
}

*/
