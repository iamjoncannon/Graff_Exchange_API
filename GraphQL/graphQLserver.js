// combine type definitions and resolvers into GraphQL api
// perform authentication from JWT token

const { ApolloServer, gql, AuthenticationError, UserInputError } = require('apollo-server-express');
const fs = require('fs')
const typeDefs = gql(fs.readFileSync(__dirname + "/schema.graphql", { encoding: "utf-8" }))
const resolvers = require('./root_resolver.js')

const validate_request = require("./authentication")

const graphQLServer = new ApolloServer({ typeDefs, 
                                         resolvers,
                                         context: validate_request
                                        });

module.exports = graphQLServer
