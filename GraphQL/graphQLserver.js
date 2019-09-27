// combine type definitions and resolvers into GraphQL api

const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const fs = require('fs')
const typeDefs = gql(fs.readFileSync(__dirname + "/schema.graphql", { encoding: "utf-8" }))
const resolvers = require('./root_resolver.js')
let jwt = require('jsonwebtoken');
let config = require('../config');

const validate_request = async ( { req } ) => {

    const token = req.headers.authorization

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
                throw new AuthenticationError('token invalid: ', err)        
            }
            
            decoded_token = result 
        })    

    }

    if(req.body.operationName !== "IntrospectionQuery") {
        
        console.log(req.body.operationName)
        // console.log("token: ", decoded_token)
        // console.log(req.body)
    }

    req.body.token = decoded_token 

    return req
}

const graphQLServer = new ApolloServer({ typeDefs, 
                                         resolvers,
                                         context: validate_request
                                        });

module.exports = graphQLServer