const signup = require("./signup")
const login = require("./login")
const postgres_db = require("../../../postgresDB_driver/postgres_driver")

let login_result

beforeAll( (done)=>{

    // delete user tables

    return postgres_db.query("delete from users; delete from holdings; delete from transactions;").then(()=>{

        const signup_variables = { input: 
            { email: "userzero@test.com", 
            password: "password",
            first_name: "User",
            last_name: "Zero"
            }
        }

        const login_variables = { 
            email: "userzero@test.com", 
            password: "password",            
        }
        
        signup( "_", signup_variables).then((result, err)=>{

            if(err) console.log(err)
                        
            db_result = result 

            login("_", login_variables).then((result)=>{

                login_result = result
                done()
            })
        })
    })
})

describe("login resolver", ()=>{

    it("succesfully calls database and retrieves user data from email and password", ()=>{
        
        expect(login_result).toBeTruthy()
    })

    it("receives first name, last name, token, balance, and id from returning row", ()=>{
        
        expect(login_result.token).toBeTruthy()
        expect(login_result.balance).toBeTruthy()
        expect(login_result.id).toBeTruthy()
        expect(login_result.first_name).toBeTruthy()
        expect(login_result.last_name).toBeTruthy()
    })
    
})

describe("login resolver", ()=>{

    it("throws error if password is incorrect", (done)=>{

        const login_variables = { 
            email: "userzero@test.com", 
            password: "",            
        }
 
        login("_", login_variables).then((result)=>{

        }).catch((err)=>{

            expect(err).toBeTruthy()
            expect(err.extensions.code).toEqual("BAD_USER_INPUT")
            done()
        })
    })
})

describe("login resolver", ()=>{

    afterAll((done)=>{

        return postgres_db.query("delete from users; delete from holdings; delete from transactions;").then(()=>{
            done()
        })

    })

    it("throws error if field is missing", (done)=>{

        const login_variables = { 
            email: "userzero@test.com",         
        }
 
        login("_", login_variables).then((result)=>{

        }).catch((err)=>{

            expect(err).toBeTruthy()
            expect(err.extensions.code).toEqual("BAD_USER_INPUT")
            done()
        })
    })
})