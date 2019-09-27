const postgres_db = require("../../postgresDB_driver/postgres_driver")
const { UserInputError } = require('apollo-server-express');

const make_trade_mutation = async ( _, { input }, req ) => {

    let user_id
    
    if(req.body.token){
    
        user_id = req.body.token.id
    }
    else{

        throw new UserInputError("Token invalid", token)
    }
    
    const { type, symbol, quantity, price } = input 
    
    const cost = price * quantity

    const is_buy = type === "Buy"

    let first_purchase // determined when we validate the trade below 

    /* 
    
    validate trade  
    
    we need to check a few different things, and
    instead of doing multiple calls, we will put them
    in one longer database query 

    note- pg doesn't support using arguments with multiple
    commands- string concatenation is not best practice as it
    exposes you to SQL injections 
    
    we will guard against injections by validating the 
    arguments before using 

    */

    // ticker symbols are never multiple words, like "; drop table users;"
    // if we validate that the symbol is one word, 
    // it should mitigate potential injections

    if(symbol.split(" ").length > 1){

        throw new UserInputError("Invalid stock symbol", symbol)
    }

    if(typeof user_id !== "number"){

        throw new UserInputError("Invalid user_id", user_id)        
    }

    const check_holdings = `select current_holding from holdings where userid = ${user_id} and symbol = '${symbol}';`

    const check_balance = `select balance from users where id = ${user_id};`

    const validate_trade_call = `${check_holdings} ${check_balance}`

    let result 
            
    try {   
        
        result = await postgres_db.query(validate_trade_call)
        
    } catch (error) {
        
        result = error
        console.log("database error in trade mutation: ", error)
    }
 
    let current_balance 
    let current_holding

    try {
        current_holding =   result[0].rows[0] ?  result[0].rows[0].current_holding : 0 ;

        first_purchase  =   result[0].rows.length === 0

        current_balance =   Number(result[1].rows[0].balance) || 0
    }
    catch(err){
        console.log(err)
        throw new UserInputError("Error validating trade", result)
    }
 
    // validate sell order 

    if(!is_buy && current_holding < quantity){

        throw new UserInputError("Transaction failed- holdings insufficient to cover sale.", result)
    }

    //validate buy order 

    if(is_buy && current_balance < cost){

        throw new UserInputError("Transaction failed- unable to cover purchase.", current_balance)
    }
            
    // transaction

    const make_first_purchase_call = "insert into holdings (userID, SYMBOL, CURRENT_HOLDING) values ($1, $2, $3) returning CURRENT_HOLDING;"

    const update_holding_call = "update holdings set current_holding = current_holding + $3 where userid = $1 and symbol = $2 returning current_holding;"
    
    const purchase_call = first_purchase ? make_first_purchase_call : update_holding_call

    const insert_transaction_call = "insert into transactions (userID, TYPE, SYMBOL, QUANTITY, PRICE) values ($1, $2, $3, $4, $5) returning *;"

    const update_balance_call = "update users set balance = balance + $1 where ID = $2 returning balance;"
    
    let holding_change = is_buy ? quantity : quantity * -1 ;

    let balance_change = is_buy ? ( cost * -1 ) : ( cost ) ;   

    const Trade_Return_Data = { symbol: symbol }
 
    try {

        await postgres_db.query('BEGIN')
                                                                                                                
        const purchase_call_output  = await postgres_db.query(purchase_call, [user_id, symbol, holding_change])
    
        const insert_transaction_call_output = await postgres_db.query(insert_transaction_call, [user_id, type, symbol, quantity, price])

        const update_balance_call_output = await postgres_db.query(update_balance_call, [ balance_change, user_id ])
    
        await postgres_db.query('COMMIT')

        if(purchase_call_output.rows){

            Trade_Return_Data["new_holding"] = purchase_call_output.rows[0].current_holding
        } 

        if(insert_transaction_call_output.rows) {
            
            const formatted_transaction_object = {
                ...insert_transaction_call_output.rows[0], 
                id: insert_transaction_call_output.rows[0].userid // rekey this property 
            }
            
            Trade_Return_Data["transaction"] = formatted_transaction_object
        }

        if(update_balance_call_output.rows){

            Trade_Return_Data["balance"] = update_balance_call_output.rows[0].balance
        }    
    } 
    catch (error) {
    
        await postgres_db.query('ROLLBACK')

        console.log("trade transaction failed", error)

        throw new UserInputError("Transaction failed", error)

    } 
    
    return Trade_Return_Data
}

module.exports = make_trade_mutation 