const signup = require("./signup")
const postgres_db = require("../../../postgresDB_driver/postgres_driver")

let db_result 

beforeAll( async (done)=>{

    postgres_db.query("delete from users; delete from holdings; delete from transactions;").then((result)=>{

        const variables = { input: 
            { email: "userone@test.com", 
            password: "password",
            first_name: "User",
            last_name: "One"
            }
        }
        
        signup( "_", variables).then((result, err)=>{

            if(err) console.log(err)
                        
            db_result = result 

            done()
        }).catch(err=> { 
            console.log("error in signup", err) 
            done()
        })
    })
})

describe("signup resolver", ()=>{

    it("succesfully calls database with signup input and registers user", ()=>{
            
        expect(db_result).toBeTruthy()
    })

    it("receives token, balance, and id from returning row", ()=>{
        
        expect(db_result.token).toBeTruthy()
        expect(db_result.balance).toBeTruthy()
        expect(db_result.id).toBeTruthy()
    })
})

describe("signup resolver", ()=>{

    it("throws error if receives duplicate email", (done)=>{

        const variables = { input: 
            { email: "userone@test.com", 
            password: "password",
            first_name: "UserOne",
            }
        }

        signup( "_", variables).then((result, err)=>{

            if(err) console.error(err)
                        
            db_result = result 
            
        }).catch((err)=>{

            expect(err).toBeTruthy()
            expect(err.extensions.code).toEqual("BAD_USER_INPUT")
            done()
        })

    })
})