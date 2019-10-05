const resolver = require("./individual_stock_news_resolver")
const { http, Redis } = require('../../../server')
const sinon = require('sinon')
const nock = require("nock")

describe("individual_stock_news_resolver",()=>{

    let data_from_api
    let data_from_redis

    beforeAll( async (done)=>{
        
        let returnData = {}
        const baseURL = "stocknewsapi.com" 
        const resource = "/api/v1?tickers=FB&items=30&token=${process.env.NEWS_API_KEY}"
        const headers = {"accept": "application/json, text/plain, */*","user-agent": "axios/0.19.0"}
        
        nock( baseURL, {
            reqheaders: headers,
          })
         .get(resource)
           .reply(200, returnData )

        sinon.spy(http, "get")

       Redis.flushdb( function (err, succeeded) {
            console.log("flushed", succeeded); // will be true if successfull
            done()
        });

        sinon.spy(Redis, "getAsync" )
    })

    afterAll(async ()=>{

        http.get.resetHistory()
    })

    it("calls an external api for data when data not stored in redis cache", async (done)=>{

        let data = await resolver({symbol: "FB"})

        data_from_api = data
        
        expect(http.get.callCount).toEqual(1)
        // the zeroeth call happens when the client initializes
        // this first Redis call checks the database and returns null
        expect(await Redis.getAsync.getCalls()[1].returnValue).toEqual(null)
        
        done()
    })

    it("resolves data from redis cache after the initial api call", async (done)=>{
      
        let data = await resolver({symbol: "FB"})

        data_from_redis = data

        expect(http.get.callCount).toEqual(1)

        expect(await Redis.getAsync.getCalls()[2].returnValue).toBeTruthy()

        done()
    })

    it("data from postgres is identical to data from Redis cache", ()=>{
    
        expect(data_from_api.data === data_from_redis.data).toEqual(true)
    })

    it("error from server returns an error", async (done)=>{

        Redis.flushdb( async function (err, succeeded) {
        
            http.get = null 
            let data = await resolver({symbol: "FB"})
            expect(data.server_error).toBeTruthy()
            done()
        });
    })
})