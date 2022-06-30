'use strict'
class MemoryRateLimiter {
  constructor(redisClient) {
    this.client = redisClient;
    this.limitedCalls;
  }
  async consumer(uniqueId, limitedCalls = 10, windowPeriod = 1) {
    this.limitedCalls = limitedCalls;
    const throttle = new Promise(async (resolve, reject) => {
      const calls = await this.client.incr(uniqueId);
      if (calls == 1) {
        await this.client.expire(uniqueId, windowPeriod);
      }
      const pttl = await this.client.pTTL(uniqueId);
      if (calls <= 10) {
        resolve(this.getRequestHeader(calls, pttl));
      } else {
        reject(this.getRequestHeader(calls, pttl));
      }
    });
    return throttle;
  }

  getRequestHeader(calls, pttl) {
    return {
      'X-API-Call-Limit': `${calls}/${this.limitedCalls}`,
      'Retry-After': pttl,
    };
  }
}

module.exports = MemoryRateLimiter;
