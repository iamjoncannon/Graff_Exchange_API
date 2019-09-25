const login = require("./resolvers/login")
const signup = require("./resolvers/signup")

const Query = {

    login: login,
}

const Mutation = {

    sign_up : signup
}

const User_Profile = require("./resolvers/User_Profile")

module.exports = { Query,
                   Mutation, 
                   User_Profile
                 }
