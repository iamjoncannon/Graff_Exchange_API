const validator = require("./authentication")
const postgres_db = require("../postgresDB_driver/postgres_driver")
const signup = require("./resolvers/authentication/signup")

describe("authentication", ()=>{

    let token_from_client 
    let user_id

    beforeAll(async (done)=>{

        await postgres_db.query("delete from users; delete from holdings; delete from transactions;") 

        const variables = { input: 
            { email: "userone@test.com", 
            password: "password",
            first_name: "User",
            last_name: "One"
            }
        }

        let result 

        try {

            result = await signup( "_", variables)
        }
        catch(error){
            console.log(error)
        }

        token_from_client = result.token 
        user_id = result.id

        done()
    })

    it("receives a valid token, decodes the token, and appends the decoded token to the origin request", async (done)=>{

        const fake_api_call_data = { req: { 
                                            headers: { 
                                                authorization: token_from_client 
                                               }, 
                                            body: {
                                                operationName: "operation requiring validation"
                                            }
                                        } 
                                    }
       
        let validation = await validator(fake_api_call_data)

        const { token } = validation.body

        expect(token.id).toEqual(user_id)

        done()
    })

    it("allows sign up, login in, and IntrospectionQuery request to pass without auth tokens", async (done)=>{

        const fake_api_call_data = { req: { 
                                            headers: { 
                                                authorization: null 
                                            }, 
                                            body: {
                                                operationName: "sign_up_call"
                                            }
                                        } 
                                    }
                                    
        expect(await validator(fake_api_call_data)).toBeTruthy()

        done()
    })

    it("returns an error if invalid token is provided for operation that requires authentication", async (done)=>{

        const fake_api_call_data = { req: { 
                                            headers: { 
                                                authorization: "invalid token" 
                                               }, 
                                            body: {
                                                operationName: "operation requiring validation"
                                            }
                                        } 
                                    }
        

        try{

            await validator(fake_api_call_data)
        }
        catch(error){

            expect(error.message).toEqual('invalid token')
        }

        done()
    })

    it("returns an error if invalid token is provided for operation that requires authentication", async (done)=>{

        const fake_api_call_data = { req: { 
                                            headers: { 
                                                 
                                               }, 
                                            body: {
                                                operationName: "operation requiring validation"
                                            }
                                        } 
                                    }
        

        try{

            await validator(fake_api_call_data)
        }
        catch(error){

            expect(error.message).toEqual("user not signed in")
        }

        done()
    })
})




