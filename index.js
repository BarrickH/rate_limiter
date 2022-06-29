const {MemoryRateLimiter} = require('./src')

const ratelimit = new MemoryRateLimiter()
ratelimit.consumer('1')