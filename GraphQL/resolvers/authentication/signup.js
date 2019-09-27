let jwt = require('jsonwebtoken');
let config = require('../../../config');
const db = require("../../../postgresDB_driver/postgres_driver")
const { UserInputError } = require('apollo-server-express');
const { genSalt, hash } = require('bcrypt');

const signup = async (_, { input }) => {

    let { password,
          first_name,
          last_name,
          email } = input

    // encrypt password

    const salt = await genSalt(10)

    hashed_password = await hash(password, salt) 
    
    // validate input and return error if invalid before SQL call
    
    const user_fields = {   first_name,
                            last_name,
                            email,
                            password: hashed_password 
                        }
    
    const has_all_fields = Object.values(user_fields).filter(value => !!value).length === 4

    if(!has_all_fields){

        throw new UserInputError('Invalid User Input', user_fields);
    }

    // insert into database, returning id and balance
    
    const create_user_call = "insert into users (first_name, last_name, email, password) values ($1, $2, $3, $4) RETURNING id, balance;"
    
    let result 
    
    try {   
        
        result = await db.query(create_user_call, Object.values(user_fields))
        
    } catch (error) {
        
        result = error

        if(error.constraint === "unique_email") throw new UserInputError('Server Error- duplicate username', result);        
    }

    if(!result.rows || !result.rows[0]){

        console.log('Server Error- unable to create user', result)
        
        throw new UserInputError('Server Error- unable to create user', result);
    }

    const { balance, id } = result.rows[0]

    // put GOOGL into their transactions for the downstream resolvers

    try {   
        const initial_holdings = `insert into holdings (userid, symbol, current_holding) values ( ${id}, 'GOOGL', 0);`
        const initial_transactions = `insert into transactions (userid, type, symbol, quantity, price) values ( ${id}, 'Buy', 'GOOGL', 0, 0);`
        
        const initial_db_population = initial_holdings + initial_transactions 

        result = await db.query(initial_db_population)
        
    } catch (error) {
        
        result = error

        if(error.constraint === "unique_email") throw new UserInputError('Server Error- duplicate username', result);        
    }

    // generate token 
    
    let token = jwt.sign( { id }, config.secret, { expiresIn: '24h'} );
          
    // return User_Profile object 

    const returned_user = { first_name,
                            last_name,
                            email,
                            token,
                            balance,
                            id
                          }

    console.log("user creds in signup call: ", id, token )

    return returned_user
}

module.exports = signup

