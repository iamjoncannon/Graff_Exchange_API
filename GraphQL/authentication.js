let jwt = require('jsonwebtoken');
let config = require('../config');
const { AuthenticationError } = require('apollo-server-express');

module.exports = async ( { req } ) => {

    let token = req.headers.authorization 

    if(token === "null") token = req.body.variables.token

    // block requests for operations that require
    // authorization, where no token is included

    const is_valid_without_authentication = ['sign_up_call',"login_call", "IntrospectionQuery"].includes(req.body.operationName)
                      
    if(!token && !is_valid_without_authentication ) {
        
        throw new AuthenticationError('user not signed in')
    }

    // validate token 

    let decoded_token 

    if( !is_valid_without_authentication ){

        jwt.verify(token, config.secret, (err, result)=>{
        
            if(err){

                console.log("token authentication error: ", err)   
                
                throw new AuthenticationError('invalid token', {message: "invalid token"})        
            
            }
            
            decoded_token = result 
        })    

    }

    if(req.body.operationName !== "IntrospectionQuery") {

        // server logging 
        console.log(req.body.operationName, "variables: ", req.body.variables)
    }

    req.body.token = decoded_token 

    return req
}
