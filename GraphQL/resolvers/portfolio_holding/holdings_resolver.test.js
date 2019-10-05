const resolver = require("./holdings_resolver")
const sinon = require('sinon')
const { Redis } = require('../../../server')

describe("holdings_resolver",()=>{

    let data_from_postgres
    let data_from_redis

    beforeAll((done)=>{

        Redis.flushdb( function (err, succeeded) {
            console.log("flushed", succeeded); // will be true if successfull
            done()
        });

        sinon.spy(Redis, "getAsync" )
    })

    afterAll(async ()=>{


    })

    it("calls postgres for data when data not stored in redis cache", async (done)=>{

        let data = await resolver({id: 1})

        data_from_postgres = data
        
        expect(await Redis.getAsync.getCalls()[1].returnValue).toEqual(null)
        
        done()
    })

    it("resolves data from redis cache after the initial database call", async (done)=>{
      
        let data = await resolver({id: 1})

        data_from_redis = data

        done()
    })

    it("data from postgres is identical to data from Redis cache", ()=>{
    
        expect(data_from_postgres.data === data_from_redis.data).toEqual(true)
    })

    it("error from server returns an error", async (done)=>{

        Redis.flushdb( async function (err, succeeded) {
        
            let data = await resolver({id: "yada"})

            expect(data.server_error).toBeTruthy()
            done()
        });
    })
})