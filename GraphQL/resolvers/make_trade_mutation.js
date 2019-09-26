let config = require('../../../config');
const db = require("../../../postgresDB_driver/postgres_driver")
const { UserInputError } = require('apollo-server-express');

// "UPDATE TableName SET TableField = TableField + 1 WHERE SomeFilterField = @ParameterID"

const make_trade_mutation = async (_, { input }) => {

    // need - user ID, symbol, transaction type, price, quantity 

    let { type, symbol, quantity, price } = input 

    const is_buy = type === "Buy"

    // validate trade 

    let balance_change = is_buy ? ( price * quantity * -1 ) : ( price * quantity ) ;   
    let holding_change = is_buy ? quantity : quantity * -1 ;

    // if buy- check current balance

        // if can't cover purchase, return error 

        if(is_buy){

            // 

            const check_balance = "select balance from users where id = $1"



        }
        else{
            
            // if sell - check current holdings 

            // if can't cover sale, return error 

        }
    

    
    // three calls involved:

    // update holdings
        // if buy, and first purchase, make separate call
    
    const make_first_holding_call = "insert into holdings (userID, SYMBOL, CURRENT_HOLDING) values ($1, $2, $3) returning CURRENT_HOLDING;"

    const update_holding_call = "update holdings set current_holding = $1 where userid = $2 and symbol = $3 returning current_holding;"


    // insert transaction

    const insert_transaction_call = "insert into transactions (userID, TYPE, SYMBOL, QUANTITY, PRICE) values ($1, $2, $3, $4, $5) returning id;"


    // update balance

    const update_balance_call = "update users set balance = $1 where ID = $2 returning balance;"



}

module.exports = make_trade_mutation 