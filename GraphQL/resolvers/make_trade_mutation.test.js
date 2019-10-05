const resolver = require("./make_trade_mutation")
const sinon = require('sinon')
const signup = require("./authentication/signup")
const postgres_db = require("../../postgresDB_driver/postgres_driver")

describe("make_trade_mutation",()=>{

    let data_from_postgres
    let users_id

    beforeAll(async (done)=>{

        await postgres_db.query("delete from users; delete from holdings; delete from transactions;")

        const signup_variables = { input: 
            { email: "userthree@test.com", 
            password: "password",
            first_name: "User",
            last_name: "Zero"
            }
        }

        let result 

        try {
        
            result = await signup( "_", signup_variables)
        }
        catch(err){
            console.error(err)
        }
                
        const mutation_variables = { input: 
            { type: "Buy", 
            symbol: "FB",
            quantity: 9,
            price: 10
            }
        }

        users_id = result.id  
        
        const req = { body: { token: { id: result.id } } }
        
        let data 
        
        try{
            
            data = await resolver("_", mutation_variables , req )
        }
        catch(err){
            
            console.error(err)
        }
                
        data_from_postgres = data

        done()

    })

    afterAll( async ()=>{

        await postgres_db.query("delete from users; delete from holdings; delete from transactions;")      
    })

    it("successfully inputs transaction into database", ()=>{

        expect(data_from_postgres).toBeTruthy()
    })

    it("returns user's new holding of that stock and their new balance, and a full transaction object", ()=>{

        expect(data_from_postgres.new_holding).toBeTruthy()
        expect(data_from_postgres.balance).toBeTruthy()
    })

    it("returns a full transaction object", ()=>{

        expect(data_from_postgres.transaction).toBeTruthy()
        expect(typeof data_from_postgres.transaction).toEqual("object")
    })

    it("if insufficient balance to cover buy, returns error", async (done)=>{
                
        const mutation_variables = { input: 
            { type: "Buy", 
            symbol: "FB",
            quantity: 900000,
            price: 1000000
            }
        }
        
        const req = { body: { token: { id: users_id } } }
                
        try{
            
            await resolver("_", mutation_variables , req )
        }
        catch(err){

            result = err
            expect(err.message).toEqual('Transaction failed- unable to cover purchase.')
        }

        done()
    })

    it("if insufficient holdings to cover sale, returns error", async (done)=>{
                
        const mutation_variables = { input: 
            { type: "Sell", 
            symbol: "FB",
            quantity: 900000,
            price: 1000000
            }
        }
        
        const req = { body: { token: { id: users_id } } }
                
        try{
            
            await resolver("_", mutation_variables , req )
        }
        catch(err){

            result = err
            expect(err.message).toEqual("Transaction failed- holdings insufficient to cover sale.")
        }

        done()
    })
})