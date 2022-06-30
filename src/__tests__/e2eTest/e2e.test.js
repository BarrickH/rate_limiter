'use strict';
const { createClient } = require('redis');
const { MemoryRateLimiter } = require('../..');

const client = createClient();
const rateLimit = new MemoryRateLimiter(client);
describe('e2e test memory rate limiter', () => {
  const simulatePeriodicallyRequests = async (uniqueId) => {
    return rateLimit.consumer(uniqueId).then((res) => res);
  };

  test('test rate limiter results', async () => {
    await client.connect();
    const uniqueId = 'test_timer';
    let limiterResults = [];
    for (let i = 0; i <= 4; i++) {
      limiterResults.push(await simulatePeriodicallyRequests(uniqueId));
    }
    const lastResults = limiterResults.pop();
    expect(lastResults['X-API-Call-Limit']).toBe('5/10');
    expect(lastResults['Retry-After']).toBeLessThan(1000);
  });
});
