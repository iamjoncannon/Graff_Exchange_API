const resolver = require("./transactions_resolver")
const signup = require("./authentication/signup")
const trade_mutation = require("./make_trade_mutation")
const postgres_db = require("../../postgresDB_driver/postgres_driver")
const { Redis } = require('../../server')
const sinon = require('sinon')

describe("transactions_resolver",()=>{

    let data_from_postgres
    let data_from_Redis
    let users_id

    beforeAll(async (done)=>{

        await Redis.flushdb()
        await postgres_db.query("delete from users; delete from holdings; delete from transactions;")

        sinon.spy(Redis, "getAsync" )

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
                
        users_id = result.id  
                
        let data 
        
        try{
            
            data = await resolver({ id: Number(result.id)})
        }
        catch(err){
            
            console.error(err)
        }
                
        data_from_postgres = data[0]

        done()

    })

    afterAll( async ()=>{

        await postgres_db.query("delete from users; delete from holdings; delete from transactions;")      
    })

    it("successfully receives transaction data from database", ()=>{

     
        expect(data_from_postgres).toBeTruthy()
    })

    it("returns a full transaction object", ()=>{

        expect(data_from_postgres.date_conducted).toBeTruthy()
        expect(data_from_postgres.userid).toBeTruthy()
        expect(data_from_postgres.type).toBeTruthy()
        expect(data_from_postgres.symbol).toBeTruthy()
    })

    it("subsequent requests are serviced by redis cache", async ()=>{

        let data 
        
        try{
            
            data = await resolver({ id: Number(users_id)})
        }
        catch(err){
            
            console.error(err)
        }

        expect(Redis.getAsync.callCount).toEqual(2)
        
        data_from_Redis = JSON.parse(await Redis.getAsync.getCalls()[1].returnValue)[0]
        
        expect(data_from_Redis).toEqual(data_from_postgres)

    })

    it("trade mutation call deletes the transactions redis key", async (done)=>{

        // make a mutation call 

        const mutation_variables = { input: 
            { type: "Buy", 
            symbol: "FB",
            quantity: 9,
            price: 10
            }
        }
        
        const req = { body: { token: { id: users_id } } }
                
        try{
            
            await trade_mutation("_", mutation_variables , req )
        }
        catch(err){
            
            console.error(err)
        }

        Redis.getAsync.resetHistory() 
        
        try{
            
            await resolver({ id: Number(users_id)})
        }
        catch(err){
            
            console.error(err)
        }

        expect(await Redis.getAsync.getCalls()[0].returnValue).toEqual(null)

        done()
    })
})