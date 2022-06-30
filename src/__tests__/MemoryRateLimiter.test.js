'use strict';
const { MemoryRateLimiter } = require('../../src');

describe('unit test memory rate limiter', () => {
  const redis = require('redis-mock'),
    client = redis.createClient();
  const rateLimit = new MemoryRateLimiter(client);
  afterEach(() => {
    client.flushall();
  });
  test('test consumer resolve', () => {
    const uniqueId = 'test_resolve';
    rateLimit
      .consumer(uniqueId, 1, 1)
      .then((res) =>
        expect(res).toBe({ 'X-API-Call-Limit': '1/1', 'Retry-After': 1000 })
      );
  });
  test('test consumer reject', () => {
    const uniqueId = 'test_reject';
    rateLimit
      .consumer(uniqueId, 0, 1)
      .then()
      .catch((rej) =>
        expect(rej).toBe({ 'X-API-Call-Limit': '1/0', 'Retry-After': 1000 })
      );
  });
});
