// combine type definitions and resolvers into GraphQL api

const { ApolloServer, gql, AuthenticationError } = require('apollo-server-express');
const fs = require('fs')
const typeDefs = gql(fs.readFileSync(__dirname + "/schema.graphql", { encoding: "utf-8" }))
const resolvers = require('./resolvers.js')

const validate_request = ({req}) => {

    const token = req.headers.authorization || null;
                                            
    if(!token && req.body.operationName !== 'sign_up_call') {

        throw new AuthenticationError('user not signed in')
    }

    if(req.body.operationName !== "IntrospectionQuery") {

        console.log(req.body, token)
    }
    
    req.body.token = token

    return req
}

const graphQLServer = new ApolloServer({ typeDefs, 
                                         resolvers,
                                         context: validate_request
                                        });

module.exports = graphQLServer
