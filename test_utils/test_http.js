const axios = require("axios")
const rateLimit = require('axios-rate-limit')
const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 10 });
// singleton axios object to prevent getting throttled by external APIs
module.exports.http = http 