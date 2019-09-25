// combine type definitions and resolvers into GraphQL api

const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const fs = require('fs')
const typeDefs = gql(fs.readFileSync(__dirname + "/schema.graphql", { encoding: "utf-8" }))
const resolvers = require('./root_resolver.js')

const validate_request = ( {req} ) => {

    const token = req.headers.authorization || null;

    req.body.token = token

    const is_valid_inauthentication = ['sign_up_call',"login_call", "IntrospectionQuery"]
                      
    if(!token && !is_valid_inauthentication.includes(req.body.operationName)) {

        throw new AuthenticationError('user not signed in')
    }

    if(req.body.operationName !== "IntrospectionQuery") {
        
        // console.log(req.body.operationName)
        // console.log(req.body)
    }

    return req
}

const graphQLServer = new ApolloServer({ typeDefs, 
                                         resolvers,
                                         context: validate_request
                                        });

module.exports = graphQLServer